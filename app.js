var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "mobility_risk"
var chosenYAxis = "pop_ofyoungagegroup"
  // function used for updating x-scale var upon click on axis label
  function xScale(riskData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(riskData, d => d[chosenXAxis]))
      .range([0, width])
    console.log(xLinearScale(4.6))  
    return xLinearScale
  
  };

  function yScale(riskData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(riskData, d => d[chosenYAxis]),
        d3.max(riskData, d => d[chosenYAxis])
      ])
      .range([0, height])
  
    return yLinearScale
  
  };
  
  // function used for updating xAxis var upon click on axis label
  function renderxAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale)
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis)
  
    return xAxis
  }

  function renderyAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale)
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis)
  
    return yAxis
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale,chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy",d=>newYScale(d[chosenYAxis]))
  
    return circlesGroup
  };
  function renderinnertext(innertext,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis){

    innertext.transition()
    .duration(1000)
    .attr("x",d=>xLinearScale(d[chosenXAxis]))
    .attr("y", d=>yLinearScale(d[chosenYAxis]))
    .attr("font-size", "10px")
    .attr('text-anchor','middle')
    .text(d=>d.Locationabbr);
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
  
    if (chosenXAxis == "mo") {
      var label = "Hair Length:"
    } else {
      var label = "# of Albums:"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup
  }
    

d3.csv("RiskData.csv", function(error,riskData){
    if (error) throw error;

    riskData.forEach(function (data) {
        data.mobility_risk = +data.mobility_risk;
        data.pop_ofyoungagegroup =+data.pop_ofyoungagegroup
        data.totalpopulation = +data.totalpopulation
        data.mental_physical_risk = +data.mental_physical_risk
        data.Locationabbr= data.Locationabbr
        data.location = data.location;
    });
        
    var xLinearScale = xScale(riskData, chosenXAxis)
    
    var yLinearScale = yScale(riskData, chosenYAxis)
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

  // CHANGE THE TEXT TO THE CORRECT COLOR
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circleGroup = chartGroup.selectAll('circle')
                .data(riskData)
                .enter()
                .append('circle')
                .attr('cx',d=>xLinearScale(d[chosenXAxis]))
                .attr('cy',d=>yLinearScale(d[chosenYAxis])) 
                .attr('r',10)
                .attr('fill', 'red') 
                .attr('opacity',.5)
                
    var innertext = chartGroup.selectAll('text')
    .data(riskData)
    .enter()
    .append("text")
    .attr("x",d=>xLinearScale(d[chosenXAxis]))
    .attr("y", d=>yLinearScale(d[chosenYAxis]))
    .attr("font-size", "10px")
    .attr('text-anchor','middle')
    .text(d=>d.Locationabbr);
    // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width/2}, ${height + 20})`)

var mobilityriskLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "mobility_risk") //value to grab for event listener
  .classed("active", true)
  .text("Mobility Risk");

var healthrisklabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "mental_physical_risk") //value to grab for event listener
  .classed("inactive", true)
  .text("Mental and Physical Health Risk");
  
  var youngageLabel = labelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0  + (height / 2) )
  .attr("y", 0 - margin.left - 420  )
  .attr("value", "pop_ofyoungagegroup") //value to grab for event listener
  .classed("active", true)
  .text("Population of 24-35 Age");

var totpoplabel = labelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0 + (height / 2) )
  .attr("y", 0 - margin.left - 400)
  .attr("value", "totalpopulation") //value to grab for event listener
  .classed("inactive", true)
  .text("Total population");  
   
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value")
      var xvalue =''
      var yvalue=''
      console.log(xvalue)
      console.log(yvalue)
      if (value == 'mental_physical_risk' || value == 'mobility_risk'){
         xvalue = value
      }
      else if (value == 'totalpopulation' || value == 'pop_ofyoungagegroup'){
         yvalue = value
     }
      
      if (xvalue != chosenXAxis && xvalue != '') {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;
        if(chosenXAxis == 'mental_physical_risk'){
            chosenYAxis = 'totalpopulation'
            yvalue = chosenYAxis
        }
        if(chosenXAxis == 'mobility_risk'){
            chosenYAxis = 'pop_ofyoungagegroup'
            yvalue = chosenYAxis
        }
      }
      console.log(yvalue)
      console.log(chosenYAxis)  
      if (yvalue != chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = yvalue;
        if(chosenYAxis == 'totalpopulation'){
            chosenXAxis = 'mental_physical_risk'
        }
        if(chosenYAxis == 'pop_ofyoungagegroup'){
            chosenXAxis = 'mobility_risk'
        }
      }

      console.log(chosenXAxis)
      console.log(chosenYAxis)
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(riskData, chosenXAxis);
        yLinearScale = yScale(riskData,chosenYAxis);

        // updates x axis with transition
        xAxis = renderxAxes(xLinearScale, xAxis);
        yAxis = renderyAxes(yLinearScale,yAxis);

        // updates circles with new x values
        circleGroup = renderCircles(circleGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);
        innertext = renderinnertext(innertext,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis)
        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis == "mental_physical_risk") {
          healthrisklabel
            .classed("active", true)
            .classed("inactive", false)
          mobilityriskLabel
            .classed("active", false)
            .classed("inactive", true)
          totpoplabel 
            .classed("active",true)
            .classed("inactive", false)
          youngageLabel
            .classed("active",false)
            .classed("inactive",true)      
        } else {
          healthrisklabel
            .classed("active", false)
            .classed("inactive", true)
          mobilityriskLabel
            .classed("active", true)
            .classed("inactive", false)
        totpoplabel
            .classed("active",false)
            .classed("inactive", true)
          youngageLabel
            .classed("active",true)
            .classed("inactive",false) 
        };
      if (chosenYAxis == "pop_ofyoungagegroup") {
        healthrisklabel
          .classed("active", false)
          .classed("inactive", true)
        mobilityriskLabel
          .classed("active", true)
          .classed("inactive", false)
        totpoplabel
          .classed("active",false)
          .classed("inactive", true)
        youngageLabel
          .classed("active",true)
          .classed("inactive",false)      
      } else {
        healthrisklabel
          .classed("active", true)
          .classed("inactive", false)
        mobilityriskLabel
          .classed("active", false)
          .classed("inactive", true)
      totpoplabel
          .classed("active",true)
          .classed("inactive", false)
        youngageLabel
          .classed("active",false)
          .classed("inactive",true) 
      };
    
  });

  var toolTip = d3.tip()
              .attr("class", "tooltip")
              .attr("transform", "translate(" + (d=>xscale(d.pop_ofyoungagegroup)   + 5  ) + ",0)")
              .offset([60, -40])
              .style("display", "block")
              .style("position", "absolute")
              .html(function (d) {
                return (`${d.location}<br>Mobility Risk ${d.mobility_risk}<br>Population: ${d.pop_ofyoungagegroup}`);
              });
          
            // Step 7: Create tooltip in the chart
            // ==============================
    chartGroup.call(toolTip);
          
            // Step 8: Create event listeners to display and hide the tooltip
            // ==============================
    circleGroup.on("mouseover", function (data) {
                toolTip.show(data);
              })
              // onmouseout event
              .on("mouseout", function (data, index) {
                toolTip.hide(data);
              });
          
                       
  })