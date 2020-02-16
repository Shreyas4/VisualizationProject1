var cols = {
    'State':'State',
    'County':'County',
    'Year':'Year',
    'NO2_1st_Max_Hour':'Hour of maximum NO2 /day',
    'O3_1st_Max_Hour':'Hour of maximum O3 /day',
    'SO2_1st_Max_Hour':'Hour of maximum SO2 /day',
    'CO_1st_Max_Hour':'Hour of maximum CO /day',
    // 'NO2_Mean':'Mean NO2 value',
    'NO2_1st_Max_Value':'Maximum NO2 value /day',
    'NO2_AQI':'NO2 Air Quality Index',
    'O3_Mean':'Mean O3 value',
    'O3_1st_Max_Value':'Maximum O3 value /day',
    'O3_AQI':'O3 Air Quality Index',
    'SO2_Mean':'Mean O3 value',
    'SO2_1st_Max_Value':'Maximum O3 value /day',
    'SO2_AQI':'SO2 Air Quality Index',
    'CO_Mean':'Mean O3 value',
    'CO_1st_Max_Value':'Maximum O3 value /day',
    'CO_AQI':'CO Air Quality Index',
    'YPLL Rate':'Years of Potential Life Lost Rate (Age-adjusted per 100,000)',
    '% Fair/Poor': 'Percent of adults that report fair or poor health',
    'Physically Unhealthy Days':'Average number of reported physically unhealthy days per month',
    'TotalPop':'Total Population Affected',
    'TotalMalePop':'Total Male Population Affected',
    'TotalFemalePop':'Total Female Population Affected'
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
            return '(C.V.) ' + cols[d];
        } else {
            return '(N.V.) ' + cols[d];
        }
    });
var no2_units = 'Parts per billion';
var o3_units = 'Parts per million';
var co_units = o3_units;
var so2_units = no2_units;

function getDataAndDrawChart() {
    var attr_select = document.getElementById("dropdown");
    var selected_attribute = attr_select.options[attr_select.selectedIndex].value;
    d3.selectAll("svg > *").remove();

    var yList = [];
    var xList = [];
    if (categorical.includes(selected_attribute)){
        d3.csv("VisData.csv").then(function (data) {
            var filteredData = data.filter(function(d){
                return d;
            });

            length = filteredData.length;
            var dataMap = {};
            for (i=0; i<length; i++){
                if (!xList.includes(filteredData[i][selected_attribute])){
                    xList.push(filteredData[i][selected_attribute]);
                    dataMap[filteredData[i][selected_attribute]] = 1;
                } else {
                    dataMap[filteredData[i][selected_attribute]] += 1;
                }
            }
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
            yList = my_sample.map(function (a) {
                return a.count;
            });
            xList = my_sample.map(function (a) {
                return a.selected_attr;
            });

            const svg = d3.select('svg');
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
            const color = '#0B3739';
            const colorScale = d3.scaleLinear()
                .domain([d3.min(yList), d3.max(yList)])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

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
                .attr('width', xScale.bandwidth())
                .attr('fill', function(d) { return colorScale(d.count) })
                .on('mouseover', function (d) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('opacity', 0.6)
                        .attr('x', (a) => xScale(a.selected_attr) - 5)
                        .attr('width', xScale.bandwidth() + 10)
                        .attr('y', (g) => yScale(g.count+d3.mean(yList)/20))
                        .attr('height', (g) => svgHeight - yScale(g.count+d3.mean(yList)/20));
                    barGroups.append("text")
                        .attr('class', 'val')
                        .attr('x', function() {
                            return xScale(d.selected_attr);
                        })
                        .attr('y', function() {
                            return yScale(d.count) - 20;
                        })
                        .text(function() {
                            return [+d.count];
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
    } else {
        const svg = d3.select('svg');
        const svgMargin = 80;
        const svgHeight =700-(2*svgMargin);
        const svgWidth = 1000-(2*svgMargin);
        const chart = svg.append('g')
            .attr('transform', 'translate('+svgMargin+','+svgMargin+')');
        let nBins = 20;
        d3.csv("VisData.csv").then(function (data) {
            var filteredData = data.filter(function(d){
                return d;
            });
            yList = [];
            length = filteredData.length;
            for (let i=0; i<length; i++) {
                yList.push(filteredData[i][selected_attribute]);
            }

            console.log(selected_attribute, yList);
            const minVal = d3.min(yList);
            const maxVal = d3.max(yList);

            const xScale = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([0, svgWidth]);

            const color = '#0B3739';

            const histData = d3.histogram()
                .thresholds(xScale.ticks(nBins))
                (yList);

            function updateChart(histData){

                chart.append('g')
                    .attr('transform', 'translate(0,'+svgHeight+')')
                    .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    .style("text-anchor", "end");

                const yMin = d3.min(histData, function(d){return d.length});
                const yMax = d3.max(histData, function(d){return d.length});

                const colorScale = d3.scaleLinear()
                    .domain([yMin, yMax])
                    .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

                const yScale = d3.scaleLinear()
                    .domain([0, yMax])
                    .range([svgHeight, 0]);

                chart.append('g')
                    .call(d3.axisLeft(yScale));

                const horizontalLines = function () {
                    return d3.axisLeft()
                        .scale(yScale)
                };

                chart.append('g')
                    .attr('class', 'grid')
                    .call(horizontalLines()
                        .tickSize(-svgWidth, 0, 0)
                        .tickFormat(''));

                const barGroups = chart.selectAll()
                    .data(histData)
                    .enter()
                    .append('g');

                barGroups.append('rect')
                    .attr('class', 'bar')
                    .attr("transform", function(d) {
                        return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
                    .attr("x", 1)
                    .attr("width", (xScale(histData[0].x1-histData[0].x0) - xScale(0)) - 1)
                    .attr("height", function(d) { return svgHeight - yScale(d.length); })
                    .attr("fill", function(d) { return colorScale(d.length) })
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('opacity', 0.6);
                        barGroups.append("text")
                            .attr('class', 'val')
                            .attr('x', function() {
                                return xScale(d.x0)+5;
                            })
                            .attr('y', function() {
                                return yScale(d.length) - 10;
                            })
                            .text(function() {
                                return [+d.length];
                            });
                    })
                    .on('mouseout', function () {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('opacity', 1);
                        d3.selectAll('.val')
                            .remove()
                    });
            }

            updateChart(histData);

            svg.append('text')
                .attr('class', 'label')
                .attr('x', - (svgHeight / 2) - svgMargin)
                .attr('y', svgMargin / 2.4)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Frequency distribution');

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
                .text('Histogram of '+cols[selected_attribute]+' in the period 2010-2016');

            svg.style('display', 'block').style('margin', 'auto');

            var dragHandler = d3.drag()
                .on("drag", function () {
                    nBins -= (d3.event.dx/10);
                    const histData = d3.histogram()
                        .thresholds(xScale.ticks(nBins))
                        (yList);
                    chart.selectAll('g').remove();
                    updateChart(histData);

                });
            dragHandler(svg);

        });
    }
}

getDataAndDrawChart();