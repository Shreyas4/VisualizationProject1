function arrayAverage(arr){
    //Find the sum
    var sum = 0;
    for(var i in arr) {
        sum += parseFloat(i);
    }
    var numbersCnt = arr.length;
    return (sum / numbersCnt);
}

var cols = {
    'State':'State',
    'County':'County',
    'Year':'Year',
    'NO2_Mean':'Mean NO2 value',
    'NO2_1st_Max_Value':'Maximum NO2 value /day',
    'NO2_1st_Max_Hour':'Hour of maximum NO2 /day',
    'NO2_AQI':'NO2 Air Quality Index',
    'O3_Mean':'Mean O3 value',
    'O3_1st_Max_Value':'Maximum O3 value /day',
    'O3_1st_Max_Hour':'Hour of maximum O3 /day',
    'O3_AQI':'O3 Air Quality Index',
    'SO2_Mean':'Mean O3 value',
    'SO2_1st_Max_Value':'Maximum O3 value /day',
    'SO2_1st_Max_Hour':'Hour of maximum O3 /day',
    'SO2_AQI':'SO2 Air Quality Index',
    'CO_Mean':'Mean O3 value',
    'CO_1st_Max_Value':'Maximum O3 value /day',
    'CO_1st_Max_Hour':'Hour of maximum O3 /day',
    'CO_AQI':'CO Air Quality Index',
    'YPLL Rate':'Years of Potential Life Lost Rate (Age-adjusted per 100,000)',
    '% Fair/Poor': 'Percent of adults that report fair or poor health',
    'Physically Unhealthy Days':'Average number of reported physically unhealthy days per month',
    'TotalPop':'Total Population',
    'TotalMalePop':'Total Male Population',
    'TotalFemalePop':'Total Female Population'
};

const dropdown = d3.select("#container")
    .insert("select", "svg")
    .on("change", getDataAndDrawChart);

dropdown.selectAll("option")
    .data(Object.keys(cols))
    .enter().append("option")
    .attr("value", function (d) { return d; })
    .text(function (d) {
        return cols[d]; // capitalize 1st letter
    });
no2_units = 'Parts per billion';
o3_units = 'Parts per million';
co_units = o3_units;
so2_units = no2_units;

// console.log(Object.keys(cols));

function getDataAndDrawChart() {
    console.log(`I'm called`);
    d3.selectAll("svg > *").remove();
    var year_select = document.getElementById("year_select");

    var selectedYear = year_select.options[year_select.selectedIndex].value;
    var yValues = [];
    var xLabels = [];

    d3.csv("VisData.csv").then(function (data) {
        var filteredDataByDate = data.filter(function(d, i){
            if (d['Year'] === selectedYear){
                return d;
            }
        });

        length = filteredDataByDate.length;
        var statesMap = {};
        for (i=0; i<length; i++){
            if (!xLabels.includes(filteredDataByDate[i]["State"])){
                xLabels.push(filteredDataByDate[i]["State"]);
                statesMap[filteredDataByDate[i]["State"]] = [filteredDataByDate[i]["NO2_Mean"]];
            } else {
                statesMap[filteredDataByDate[i]["State"]].push(filteredDataByDate[i]["NO2_Mean"]);
            }
        }

        for (var key in statesMap){
            yValues.push(parseFloat(arrayAverage(statesMap[key]).toFixed(2)));
        }

        var my_sample = [];
        for (var i=0; i<xLabels.length; i++) {
            my_sample.push({'state':xLabels[i], 'no2_mean':yValues[i]});
        }
        my_sample.sort(function(a, b){return a.no2_mean-b.no2_mean});
        my_sample = my_sample.reverse();
        my_sample = my_sample.slice(0,12);
        yValues = my_sample.map(function (a) {
            return a.no2_mean;
        });
        xLabels = my_sample.map(function (a) {
            return a.state;
        });
        const svg = d3.select('svg');
        const svgContainer = d3.select('#container');
        const svgMargin = 80;
        const svgHeight =600-(2*svgMargin);
        const svgWidth = 800-(2*svgMargin);
        const chart = svg.append('g')
            .attr('transform', 'translate('+svgMargin+','+svgMargin+')');

        const xScale = d3.scaleBand()
            .range([0, svgWidth])
            .domain(xLabels)
            .padding(0.35);

        const yScale = d3.scaleLinear()
            .range([svgHeight, 0])
            .domain([0, d3.max(yValues)+d3.max(yValues)/10]);

        const horizontalLines = function () {
            return d3.axisLeft()
                .scale(yScale)
        };

        chart.append('g')
            .attr('transform', 'translate(0,'+svgHeight+')')
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        chart.append('g')
            .call(d3.axisLeft(yScale));

        chart.append('g')
            .attr('class', 'grid')
            .call(horizontalLines()
                .tickSize(-svgWidth, 0, 0)
                .tickFormat(''));

        const barGroups = chart.selectAll()
            .data(my_sample)
            .enter()
            .append('g');

        barGroups.append('rect')
            .attr('class', 'bar')
            .attr('x', function(g) {
                return xScale(g.state);  //Bar width of 20 plus 1 for padding
            })
            .attr('y', function (g) {
                return yScale(g.no2_mean);
            })
            .attr('height', function (g) {
                return svgHeight - yScale(g.no2_mean);
            })
            // .attr('fill',function (g) {
            //     return d3.rgb(0,0,g.no2_mean*29);
            // })
            .attr('width', xScale.bandwidth())
            .on('mouseover', function (d) {
                // var translate = d3.transform(d3.select(this.parentNode).attr("transform")).translate;
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('opacity', 0.6)
                    .attr('x', (a) => xScale(a.state) - 5)
                    .attr('width', xScale.bandwidth() + 10)
                    .attr('y', (g) => yScale(g.no2_mean+d3.mean(yValues)/20))
                    .attr('height', (g) => svgHeight - yScale(g.no2_mean+d3.mean(yValues)/20));
                barGroups.append("text")
                    .attr('class', 'val') // add class to text label
                    .attr('x', function() {
                        return xScale(d.state);
                    })
                    .attr('y', function() {
                        return yScale(d.no2_mean) - 20;
                    })
                    .text(function() {
                        return [+d.no2_mean];  // Value of the text
                    });
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('opacity', 1)
                    .attr('x', (a) => xScale(a.state))
                    .attr('width', xScale.bandwidth())
                    .attr('y', (g) => yScale(g.no2_mean))
                    .attr('height', (g) => svgHeight - yScale(g.no2_mean));
                d3.selectAll('.val')
                    .remove()
            });

        svg.append('text')
            .attr('class', 'label')
            .attr('x', - (svgHeight / 2) - svgMargin)
            .attr('y', svgMargin / 2.4)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('NO2 Mean');

        svg.append('text')
            .attr('class', 'label')
            .attr('x', svgWidth / 2 + svgMargin)
            .attr('y', svgHeight + svgMargin*2.5)
            .attr('text-anchor', 'middle')
            .text('State');

        svg.append('text')
            .attr('class', 'title')
            .attr('x', svgWidth / 2 + svgMargin)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('NO2 Mean by State');

        svg.style('display', 'block').style('margin', 'auto');
    });
}

getDataAndDrawChart();