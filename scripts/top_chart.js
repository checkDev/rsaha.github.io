
class TopChart {

    margin;
    pixelSize = 55;
    width =0 ; height = 0;
    slideVal = 0;
    xAttr = "Country";
    filteredData;
    Tooltip;
    parseTime;
    constructor(width , height ,data , margin)
    {

        this.parseTime = d3.timeParse("%Y");
        this.width = width;
        this.height = height;
        this.data = data;
        this.margin = margin;
        this.svg = this.createChart();
        this.color  = d3.scaleOrdinal()
                    .domain(data.map(d => d.Country))
                    .range(d3.schemeCategory10);
        this.size = d3.scaleLinear() // can be Dynamic ??
                    .domain([0, d3.max(d => d.GrandTotal)])
                    .range([7,100])  // circle will be between 7 and 100 px wide
                           
    }


    createChart(){

        console.log(" circle chart ----- " +this.margin.left + " top " + this.margin.top + "---- " + this.width + "---- " + this.height );
        var svg = d3.select("#contentChart")
        .append("svg")
        .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")")
          .attr("width", this.width)
          .attr("height", this.height);
        
        return svg;  
    }


    clearAnnotation()
    {

    }

    infoUpdateBar(slide)
    {
        this.slideVal = slide;

    }

    annotateBar() {
           //do based on the slide
    }

    toggleSceneBtns() {

    }

      // Three function that change the tooltip when user hover / move / leave a cell
    mouseover = function(d, that) {
        //Tooltip =   d3.select("#tooltip");
        console.log("that "  +that);
        Tooltip
            .style("opacity", 1)
            .html('<u>' + d.Country + '</u>' + "<br>" +
                '<u>' + d.Year + '</u>' + "<br>" +
                d.GrandTotal + " medals")
                .style("left", (d3.event.pageX)+10 + "px") 
                .style("top", (d3.event.pageY)+20 + "px");
    }
    mousemove = function(d) {
    }
    mouseleave = function(d) {
        Tooltip =   d3.select("#Circletooltip");
        Tooltip
            .style("opacity", 0);
     }

    drawChart(filteredData) {
        this.pixelSize = 80   
    //    for(var i = 0 ; i < filteredData.length ; i++)
    //      console.log(filteredData[i]); 
       var color  = d3.scaleOrdinal()
                .domain(filteredData.map(d=> d[this.xAttr]))
                .range(d3.schemeCategory10);
        
       var size = d3.scaleLinear() // can be Dynamic ??
        .domain([0, 500])
        .range([7,this.pixelSize])  // circle will be between 7 and 100 px wide


        var elem = this.svg.selectAll("g")
        .data(filteredData)
        var elemEnter = elem.enter()
        .append("g")
        .attr("transform", function(d){return "translate(80)"})

        var wi = this.width, hi = this.height; 
        
        var Tooltip =   d3.select("#Circletooltip");
        // console.log("that "  +that);
        
         
        var node = elemEnter
            .append("circle")
            .attr("class", "node")
            .attr("r", function(d){ 
                //console.log( "size:" + size(d.GrandTotal) );
                return size(d.GrandTotal)})
            .attr("cx", wi / 2)
            .attr("cy", hi / 2)
            .style("fill", function(d){ 
                //console.log("Country " + color(d.Country));
                return color(d.Country)})
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            //.html(  "<title> Hello"+ "\n </title>")
            .on("mouseover", function(d){
                Tooltip
                .style("opacity", 1)
                .html('<u>' + d.CountryName + '</u>' + "<br>" +
                    '<u>' + d.Year.getFullYear() + '</u>' + "<br>" +
                    d.GrandTotal + " medals")
                    .style("left", (d3.event.pageX)+10 + "px") 
                    .style("top", (d3.event.pageY)+20 + "px");
            } ) // What to do when hovered
            //.on("mousemove", this.mousemove)
           . on("mouseleave", function(d){
            Tooltip
            .style("opacity", 0)
           
        } )

        // elemEnter.append("text")
        //     .attr("dx", function (d) {
        //     return -20
        //      })
        //     .text(function (d) {
        //             return d.Country;
        //     })

      var nodeText =  elemEnter
            .append("text")
            .attr("x", wi/2)
            .attr("y", hi/2)
            .attr("font-family", "sans-serif")
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-size", "8px")
            .attr("stroke", "black")
            .attr("visibility", function(d){
                return d.GrandTotal >= 80 ? "visible" : "hidden"})
            .text(d => d.Country);



        // .call(d3.drag() // call specific function when circle is dragged
        //      .on("start", dragstarted)
        //      .on("drag", dragged)
        //      .on("end", dragended));


// Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(wi / 2).y(hi / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.GrandTotal)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(filteredData)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
        nodeText
            .attr("x", function(d){ return d.x -5; })
            .attr("y", function(d){ return d.y ; })    
      });
  
  }

    updateScene(startVal, endVal)
    {
        this.svg.selectAll("g").remove(); 
        console.log("updateScene Circle Chart aclled");
       this.filteredData = [];
       var startD = this.parseTime(startVal) , endD = this.parseTime(endVal);
       this.filteredData =  this.data.filter(function(d){ 
            //console.log("Country : " + d.Country + " Total: " + d.GrandTotal +  " Bronze: " + d.Bronze);
            return ( d.Year >= startD  && d.Year <= endD //d.GrandTotal >20
            );

        });
        //console.log("circleData=>" +this.filteredData);
        this.drawChart(this.filteredData);
     
    }
   

};