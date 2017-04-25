/* Create a barchart of drinking patterns*/
$(function() {
    // Read in prepped_data file
    d3.csv('data/amusement_parks.csv', function(error, allData) {
        // track state and year (between 2010 and 2012) in vars to be filtered
        var state = 'California'; // default as CA
        var year = 2012; // default as 2012
        $('.choice').on('click', function() {
            console.log('---------------')
            var val = $(this)[0].text;
            var isYear = $(this).hasClass('year');
            if (isYear) year = +val;
            else state = val;
            console.log(year);
            console.log(state);
            var currentData = filterData();
            draw(currentData);
        });

        // Filter data down & sort data alphabetically
        var data = allData.filter(function(d) {
                return d.state == state && d.year == year
            }).sort(function(a, b) {
                if (a.state < b.state) return -1;
                if (a.state > b.state) return 1;
                return 0;
            });

        // Margin: how much space to put in the SVG for axes/titles
        var margin = {
            left: 70,
            bottom: 100,
            top: 50,
            right: 50
        };

        // Height and width of the total area
        var height = 600;
        var width = 1000;

        // Height/width of the drawing area for data symbols
        var drawHeight = height - margin.bottom - margin.top;
        var drawWidth = width - margin.left - margin.right;

        // Select SVG to work with, setting width and height (the vis <div> is defined in the index.html file)
        var svg = d3.select('#vis')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        // Append a 'g' element in which to place the rects, shifted down and right from the top left corner
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        // Append an xaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        // Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        // Append text to label the y axis (don't specify the text yet)
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
            .attr('class', 'title');

        // Append text to label the y axis (don't specify the text yet)
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        // Define xAxis using d3.axisBottom(). Scale will be set in the setAxes function.
        var xAxis = d3.axisBottom();

        // Define yAxis using d3.axisLeft(). Scale will be set in the setAxes function.
        var yAxis = d3.axisLeft()
            .tickFormat(d3.format('.2s'));

        // Define an xScale with d3.scaleBand. Domain/rage will be set in the setScales function.
        var xScale = d3.scaleBand();

        // Define a yScale with d3.scaleLinear. Domain/rage will be set in the setScales function.
        var yScale = d3.scaleLinear();

        // Write a function for setting scales.
        var setScales = function(data) {
            // Get the unique values of states for the domain of your x scale
            var parks = data.map(function(d) {
                return d.theme_park;
            });

            // Set the domain/range of your xScale
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(parks);

            // Get min/max values of the percent data (for your yScale domain)
            var yMin = d3.min(data, function(d) {
                return +d.attendance;
            });

            var yMax = d3.max(data, function(d) {
                return +d.attendance;
            });

            // Set the domain/range of your yScale
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        };

        var setAxes = function() {
            // Set the scale of your xAxis object
            xAxis.scale(xScale);

            // Set the scale of your yAxis object
            yAxis.scale(yScale);

            // Render (call) your xAxis in your xAxisLabel
            xAxisLabel.transition().duration(500).call(xAxis);

            // Render (call) your yAxis in your yAxisLabel
            yAxisLabel.transition().duration(500).call(yAxis);

            // Update xAxisText and yAxisText labels
            xAxisText.text('Theme Parks');
            yAxisText.text('Attendance (' + state + ', ' + year + ')');
        }

        var filterData = function() {
            var currentData = allData.filter(function(d) {
                    return d.state == state && d.year == year
                })
                // Sort the data alphabetically
                // Hint: http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
                .sort(function(a, b) {
                    if (a.state < b.state) return -1;
                    if (a.state > b.state) return 1;
                    return 0;
                });
            return currentData;
        };

        // Get the unique values of states for the domain of your x scale
        var parks = data.map(function(d) {
            return d.theme_park;
        });

        // Set the domain/range of your xScale
        xScale.range([0, drawWidth])
            .padding(0.1)
            .domain(parks);

        // Get min/max values of the percent data (for your yScale domain)
        var yMin = d3.min(data, function(d) {
            return +d.attendance;
        });

        var yMax = d3.max(data, function(d) {
            return +d.attendance;
        });

        // Set the domain/range of your yScale
        yScale.range([drawHeight, 0])
            .domain([0, yMax]);

        // Set the scale of your xAxis object
        xAxis.scale(xScale);

        // Set the scale of your yAxis object
        yAxis.scale(yScale);

        // Render (call) your xAxis in your xAxisLabel
        xAxisLabel.call(xAxis);

        // Render (call) your yAxis in your yAxisLabel
        yAxisLabel.call(yAxis);

        // Update xAxisText and yAxisText labels
        xAxisText.text('Theme Parks');
        yAxisText.text('Attendance (' + state + ', ' + year + ')');


        // Add tip
        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d.theme_park;
        });
        g.call(tip);

        // Store the data-join in a function: make sure to set the scales and update the axes in your function.
        // Select all rects and bind data
        var bars = g.selectAll('rect').data(data);

        // Use the .enter() method to get your entering elements, and assign initial positions
        bars.enter().append('rect')
            .merge(bars)
            .attr('x', function(d) {
                return xScale(d.theme_park);
            })
            .attr('class', 'bar')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('width', xScale.bandwidth())
            .attr('y', function(d) {
                return yScale(d.attendance);
            })
            .attr('height', function(d) {
                return drawHeight - yScale(d.attendance);
            });
        bars.exit().remove();

        var draw = function(data) {
            // Set scales
            setScales(data);

            // Set axes
            setAxes();

            // Select all rects and bind data
            var bars = g.selectAll('rect').data(data);

            // Use the .enter() method to get your entering elements, and assign initial positions
            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.theme_park);
                })
                .attr('y', function(d) {
                    return drawHeight;
                })
                .attr('height', 0)
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr('width', xScale.bandwidth())
                .merge(bars)
                .transition()
                .duration(300)
                .delay(function(d, i) {
                    return i * 10;
                })
                .attr('y', function(d) {
                    return yScale(d.attendance);
                })
                .attr('height', function(d) {
                    return drawHeight - yScale(d.attendance);
                });

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            bars.exit().remove();
        };
    });
});