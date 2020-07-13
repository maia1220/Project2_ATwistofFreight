
// View 4
// Anastasia's


// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      right: 100,
      bottom: 150,
      left: 150
    };
  
//calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#Chart1").append("div").classed("chart", true);


//append an svg element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "Within_ktons";
var chosenYAxis = "Within__MDollars";

//function used for updating x-scale var upon clicking on axis label
function xScale(censusData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
};

//function used for updating y-scale var upon clicking on axis label
function yScale(censusData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
};

//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
};

//function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
};

//function used for updating circles group with a transition to new circles
//for change in x axis or y axis 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
};

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
};

//# function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //#select x label
    //Within tons
    if (chosenXAxis === 'Within_ktons') {
        var xLabel = "Within State Tonnage:";
    }
    //Inbound tons
    else if (chosenXAxis === 'InterstateIn_ktons') {
        var xLabel = "Inbound Tonnage:";
    }
    //Outbound tons
    else {
        var xLabel = "Outbound Tonnage:";
    };

    //select y label
    //percentage lacking healthcare
    if (chosenYAxis === 'InterstateIn_Mdollars') {
        var yLabel = "Interstate Inbound:"
    }
    //percentage obese
    else if (chosenYAxis === 'InterstateOut_MDollars') {
        var yLabel = "Interstate Outbound:"
    }
    //smoking percentage
   
    else {
        var yLabel = "Within State:"
    };

    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.State}<br>${xLabel} ${d[chosenXAxis]} (x 1000 Ton)<br>${yLabel} ${d[chosenYAxis]} (in Mil $)`);
        });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
};


//retrieve json data and execute everything below
//Reminders: make another 3 datasets 
d3.json("/outputF").then(function(censusData, error) {
    if (error) throw error;

    console.log("census data");
    console.log(censusData);

    //parse data
    
    censusData.forEach(function(data) {
        data.Within_ktons = +data.Within_ktons;
        data.InterstateIn_ktons = +data.InterstateIn_ktons;
        data.InterstateOut_ktons = +data.InterstateOut_ktons;
        data.Within__MDollars = +data.Within__MDollars;
        data.InterstateIn_Mdollars = +data.InterstateIn_Mdollars;
        data.InterstateOut_MDollars = +data.InterstateOut_MDollars;
        data.State = data.State;
    });
    
    //create first linear scales
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("opacity", ".8");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var Within_ktonsLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "Within_ktons")
        .text("Within-State Tonnage (1000t)");

    var InterstateIn_ktonsLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "InterstateIn_ktons")
        .text("Inbound Tonnage (1000t)");

    var InterstateOut_ktonsLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "InterstateOut_ktons")
        .text("Outbound Tonnage (1000t)");

    //create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var Within__MDollarsLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", "-40")
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "Within__MDollars")
        .text("Freight Within State (Mil $)");

    var InterstateIn_MdollarsLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", "-60")
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "InterstateIn_Mdollars")
        .text("Inbound Freight (Mil $)");

    var InterstateOut_MDollarsLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", "-80")
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "InterstateOut_MDollars")
        .text("Outbound Freight (Mil $)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //change classes to change bold text
                if (chosenXAxis === "Within_ktons") {
                    Within_ktonsLabel.classed("active", true).classed("inactive", false);
                    InterstateIn_ktonsLabel.classed("active", false).classed("inactive", true);
                    InterstateOut_ktonsLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "InterstateIn_ktons") {
                    Within_ktonsLabel.classed("active", false).classed("inactive", true);
                    InterstateIn_ktonsLabel.classed("active", true).classed("inactive", false);
                    InterstateOut_ktonsLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    Within_ktonsLabel.classed("active", false).classed("inactive", true);
                    InterstateIn_ktonsLabel.classed("active", false).classed("inactive", true);
                    InterstateOut_ktonsLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

            //replace chosenYAxis with value
            chosenYAxis = value;

            //update y scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            //update x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text with new y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            //update tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //change classes to change bold text
            if (chosenYAxis === "Within__MDollars") {
                Within__MDollarsLabel.classed("active", true).classed("inactive", false);
                InterstateIn_MdollarsLabel.classed("active", false).classed("inactive", true);
                InterstateOut_MDollarsLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "InterstateIn_Mdollars") {
                Within__MDollarsLabel.classed("active", false).classed("inactive", true);
                InterstateIn_MdollarsLabel.classed("active", true).classed("inactive", false);
                InterstateOut_MDollarsLabel.classed("active", false).classed("inactive", true);
            }
            else {
                Within__MDollarsLabel.classed("active", false).classed("inactive", true);
                InterstateIn_MdollarsLabel.classed("active", false).classed("inactive", true);
                InterstateOut_MDollarsLabel.classed("active", true).classed("inactive", false);
            }
        }
    });
    
});
};
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);