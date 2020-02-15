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

var categorical = ['State', 'County', 'Year', 'NO2_1st_Max_Hour', 'O3_1st_Max_Hour', 'SO2_1st_Max_Hour', 'CO_1st_Max_Hour'];

var numerical = Object.keys(cols).filter( function( el ) {
    return !categorical.includes( el );
} );

const dropdown = d3.select("#select_box")
    .insert("select")
    .attr('id', 'dropdown')
    .on("change", getDataAndDrawChart);

dropdown.selectAll("option")
    .data(Object.keys(cols))
    .enter().append("option")
    .attr("value", function (d) { return d; })
    .attr('style', 'font-size:medium')
    .text(function (d) {
        if(categorical.includes(d)){
            return '(C) ' + cols[d];
        } else {
            return '(N) ' + cols[d];
        }
    });
no2_units = 'Parts per billion';
o3_units = 'Parts per million';
co_units = o3_units;
so2_units = no2_units;

function getDataAndDrawChart() {
    var attr_select = document.getElementById("dropdown");
    var selected_attribute = attr_select.options[attr_select.selectedIndex].value;
    d3.selectAll("svg > *").remove();

    var yList = [];
    var xList = [];
    if (categorical.includes(selected_attribute)){
        d3.csv("VisData.csv").then(function (data) {
            var filteredDataByDate = data.filter(function(d, i){
                return d[selected_attribute];
            });


            length = filteredDataByDate.length;
            var dataMap = {};
            for (i=0; i<length; i++){
                if (!xList.includes(filteredDataByDate[i][selected_attribute])){
                    xList.push(filteredDataByDate[i][selected_attribute]);
                    dataMap[filteredDataByDate[i][selected_attribute]] = 1;
                } else {
                    dataMap[filteredDataByDate[i][selected_attribute]] += 1;
                }
            }
            console.log(dataMap);
            for (var key in dataMap){
                yList.push(dataMap[key]);
            }

            var my_sample = [];
            for (var i=0; i<xList.length; i++) {
                my_sample.push({'selected_attr':xList[i], 'count':yList[i]});
            }
            my_sample.sort(function(a, b){return a.count-b.count});
            my_sample = my_sample.reverse();
            var add_clause = '';
            if (my_sample.length >12){
                my_sample = my_sample.slice(0,12);
                add_clause = ' (Top 12)'
            }
            console.log(my_sample);
            yList = my_sample.map(function (a) {
                return a.count;
            });
            xList = my_sample.map(function (a) {
                return a.selected_attr;
            });

            const svg = d3.select('svg');
            const svgContainer = d3.select('#container');
            const svgMargin = 80;
            const svgHeight =700-(2*svgMargin);
            const svgWidth = 1000-(2*svgMargin);
            const chart = svg.append('g')
                .attr('transform', 'translate('+svgMargin+','+svgMargin+')');

            const xScale = d3.scaleBand()
                .range([0, svgWidth])
                .domain(xList)
                .padding(0.35);

            const yScale = d3.scaleLinear()
                .range([svgHeight, 0])
                .domain([0, d3.max(yList)+d3.max(yList)/10]);

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
                    return xScale(g.selected_attr);  //Bar width of 20 plus 1 for padding
                })
                .attr('y', function (g) {
                    return yScale(g.count);
                })
                .attr('height', function (g) {
                    return svgHeight - yScale(g.count);
                })
                // .attr('fill',function (g) {
                //     return d3.rgb(0,0,g.count*29);
                // })
                .attr('width', xScale.bandwidth())
                .on('mouseover', function (d) {
                    // var translate = d3.transform(d3.select(this.parentNode).attr("transform")).translate;
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('opacity', 0.6)
                        .attr('x', (a) => xScale(a.selected_attr) - 5)
                        .attr('width', xScale.bandwidth() + 10)
                        .attr('y', (g) => yScale(g.count+d3.mean(yList)/20))
                        .attr('height', (g) => svgHeight - yScale(g.count+d3.mean(yList)/20));
                    barGroups.append("text")
                        .attr('class', 'val') // add class to text label
                        .attr('x', function() {
                            return xScale(d.selected_attr);
                        })
                        .attr('y', function() {
                            return yScale(d.count) - 20;
                        })
                        .text(function() {
                            return [+d.count];  // Value of the text
                        });
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('opacity', 1)
                        .attr('x', (a) => xScale(a.selected_attr))
                        .attr('width', xScale.bandwidth())
                        .attr('y', (g) => yScale(g.count))
                        .attr('height', (g) => svgHeight - yScale(g.count));
                    d3.selectAll('.val')
                        .remove()
                });

            svg.append('text')
                .attr('class', 'label')
                .attr('x', - (svgHeight / 2) - svgMargin)
                .attr('y', svgMargin / 2.4)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Count');

            svg.append('text')
                .attr('class', 'label')
                .attr('x', svgWidth / 2 + svgMargin)
                .attr('y', svgHeight + svgMargin*2.5)
                .attr('text-anchor', 'middle')
                .text(cols[selected_attribute]);

            svg.append('text')
                .attr('class', 'title')
                .attr('x', svgWidth / 2 + svgMargin)
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .text('Frequency of each '+cols[selected_attribute]+' observed from 2010-2016'+add_clause);

            svg.style('display', 'block').style('margin', 'auto');
        });
    }
}

getDataAndDrawChart();