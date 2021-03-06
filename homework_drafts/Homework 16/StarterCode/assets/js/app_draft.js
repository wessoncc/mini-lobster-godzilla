var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv")
    .then(function(CensusData) {
        CensusData.forEach(function(data) {
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });
        var xLinearScale = d3.scaleLinear()
            .domain([(-2 + d3.min(CensusData, d => d.smokes)), (2 + d3.max(CensusData, d => d.smokes))])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([(-2 + d3.min(CensusData, d => d.obesity)), (2 + d3.max(CensusData, d => d.obesity))])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
        .data(CensusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>Smoking rate: ${d.smokes}<br>Obesity rate: ${d.obesity}`);
            });

        chartGroup.call(toolTip);

        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 30)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("text-anchor", "middle")
            .attr("font-weight", 650)
            .text("Obesity (%)");

        // chartGroup.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left + 60)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .attr("class", "axisText")
        //     .attr("text-anchor", "middle")
        //     .text("Lack Healthcare (%)");

        // chartGroup.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left + 90)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .attr("class", "axisText")
        //     .attr("text-anchor", "middle")
        //     .text("Age (Median)");  

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
            .attr("class", "axisText")
            .attr("text-anchor", "middle")
            .attr("font-weight", 650)
            .text("Smoking Rate (%)");
  
        // chartGroup.append("text")
        //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
        //     .attr("class", "axisText")
        //     .attr("text-anchor", "middle")
        //     .text("Smokers");

        // chartGroup.append("text")
        //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 75})`)
        //     .attr("class", "axisText")
        //     .attr("text-anchor", "middle")
        //     .text("Household Income (Median");
        });
