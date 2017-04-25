$(function() {
    d3.csv('data/amusement_parks.csv', function(error, allData) {
        var state = 'California';
        var year = '2012';

        var margin = {
            left: 70,
            bottom: 100,
            top: 50,
            right: 50
        };
        var height = 600;
        var width = 1000;

        var drawHeight = height - margin.bottom - margin.top;
        var drawWidth = width - margin.left - margin.right;

        var svg = d3.select('#vis')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 90) + ')')
            .attr('class', 'title');

        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 50) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        var xAxis = d3.axisBottom();
        var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));

        var xScale = d3.scaleBand();
        var yScale = d3.scaleLinear();

        var setScales = function(data) {
            var parks = data.map(d=>d.theme_park);
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(parks);

            // svg.select(".axis").selectAll("text").remove();
            // var ticks = svg.select(".axis").selectAll(".tick")
            //             .data(data)
            //             .append("svg:image")
            //             .attr("xlink:href", d=>("../img/" + d.photo))
            //             .attr("width", 50)
            //             .attr("height", 50)
            //             .attr("x", -25)
            //             .attr("y", 10);

            var yMin = d3.min(data, d=>+d.attendance);
            var yMax = d3.max(data, d=>+d.attendance);
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        };

        var setAxes = function() {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel.transition().duration(500).call(xAxis);
            xAxisLabel.selectAll('text')
                  .style('text-anchor', 'end')
                  .attr("dx", "-.2em")
                  .attr("dy", ".15em")
                  .attr('transform', 'rotate(-25)');

            yAxisLabel.transition().duration(500).call(yAxis);

            xAxisText.text('Theme Parks');
            yAxisText.text('Attendance (' + state + ', ' + year + ')');
        }

        var filterData = function() {
            var currentData = allData.filter(function(d) {
                    return d.state == state && d.year == year
                }).sort(function(a, b) {
                    if (a.state < b.state) return -1;
                    if (a.state > b.state) return 1;
                    return 0;
                });
            return currentData;
        };

        var allStates = function() {
            var currentData = allData.filter(d=>d.year == year);
            return currentData;
        };

        var tip = d3.tip().attr('class', 'd3-tip').html(d=>(d.theme_park + "<br/>" + d.attendance + " attendances"));
        g.call(tip);

        var states = ["California", "Canada", "Florida", "Ohio"]
        var colorScale = d3.scaleOrdinal().domain(states).range(d3.schemeCategory10);

        var draw = function(data) {
            setScales(data);
            setAxes();

            var bars = g.selectAll('rect').data(data);
            bars.enter().append('rect')
                .merge(bars)
                .attr('x', d=>xScale(d.theme_park))
                .attr('y', d=>drawHeight)
                .attr('height', 0)
                .attr('class', 'bar')
                .style('fill', d=>colorScale(d.state))
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr('width', xScale.bandwidth())
                .transition()
                .duration(500)
                .attr('y', d=>yScale(d.attendance))
                .attr('height', d=>(drawHeight - yScale(d.attendance)));
            bars.exit().remove();
        };

        $('.choice').on('click', function() {
            var val = $(this)[0].text;
            var isYear = $(this).hasClass('year');
            if (isYear) year = val;
            else state = val;
            if (year != "All" && state != "All") {
                var currentData = filterData();
                draw(currentData);
            } else if (state == "All") {
                var currentData = allStates();
                draw(currentData);

                var legend = svg.selectAll(".legend")
                    .data(states)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", colorScale)
                    .style("opacity", 0.4);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(d=>d);
            }
        });
        var currentData = filterData();
        draw(currentData);
    });
});