class BarChart {
    constructor(width , height , data  , margin )
     {
            this.parseTime = d3.timeParse("%Y");
            this.slideVal = 0;
            this.data = data;
            this.width = width;
            this.height = height;
            this.barData = data;
            this.margin = margin;
            this.subGroups = data.columns.slice(2,5);
            this.svgBar = this.createChart();
            this.colorLegendBronze = '#B0E0E6';
            this.colorLegendGold= '#FF8C00';
            this.colorLegendSilver ='#EEF5DB';
            this.createColorLegendForMedals();
            this.xbarScale =0;
            this.ybarScale =0;
           
     }
     clearBarChartAnnotation()
    {
        console.log("clearBarChartAnnotation");
        let barChart = this.svgBar;
        barChart.selectAll("#antCir").remove();
        barChart.selectAll("#antPath").remove();
        barChart.selectAll("#antText").remove();

    }

     annotateBarChart(x,y , ax, ay, textx, texty ,textVal )
     {
         console.log("annotateLineChart --");
         let barChart = this.svgBar;
         var xcoord = 0,
             ycoord = 0,
          x2coord = 0,
             y2coord = 0;
        let offsetPadding =4;
         let xscaleChart= this.xbarScale;
         let yscaleChart = this.ybarScale;
         let timeParse = this.parseTime;
         barChart.append("circle")
         .transition().duration(900)
         .attr("id", "antCir")
         .style("opacity", "0.5")
         .style("border", "2px")
         .style("stroke", "blue")
         .attr("cx", function() {
             xcoord = xscaleChart(x)+offsetPadding;
             return xcoord;
         })
         .attr("cy", function() {
             ycoord = yscaleChart(y);
             return ycoord + 1;
         })
         .attr("r", 10);
     //console.log("xcoord:" + xcoord + ", ycoord:" + ycoord + " - currentSlide]: " + currentSlide);
     x2coord = xcoord + ax;
     y2coord = ycoord + ay;
     barChart.append("line")
         .transition().duration(900)
         .style("stroke", "blue")
         .attr("id", "antPath")
         .attr("stroke", "black")
         .attr("stroke-width", 1.5)
         .attr("x1", xcoord+offsetPadding)
         .attr("y1", ycoord)
         .attr("x2", x2coord)
         .attr("y2", y2coord)
 
         barChart.append("text")
         .transition().duration(900)
         .attr("id", "antText")
         .attr("x", x2coord + textx)
         .attr("y", y2coord + texty)
         .text(textVal);
     }
     createColorLegendForMedals(){
    
        var offset = 80;
        
        this.svgBar.append("text")
           .attr("x", (this.width / 2) + offset )
            .attr("y", 2).text("Bronze")
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle")
            .style("font-weight" , "bold")

        this.svgBar.append("rect")
           .attr("x", (this.width / 2) + offset -20)
            .attr("y", -2)
            .attr("width", 18)
            .attr("height", 10)
            .style("fill", this.colorLegendBronze)
       
        
        this.svgBar.append("text")
            .attr("x", (this.width / 2) +10)
             .attr("y", 2).text("Gold")
             .style("font-size", "12px")
             .attr("alignment-baseline", "middle")
             .style("font-weight" , "bold")

        this.svgBar.append("rect")
            .attr("x", (this.width / 2)-10 )
             .attr("y", -2)
             .attr("width", 18)
             .attr("height", 10)
             .style("fill", this.colorLegendGold)
             
        
        
         
        this.svgBar.append("text")
             .attr("x", (this.width / 2)  - offset+10)
              .attr("y", 2).text("Silver")
              .style("font-size", "12px")
              .attr("alignment-baseline", "middle")
              .style("font-weight" , "bold") 
              
        this.svgBar.append("rect")
              .attr("x", (this.width / 2) - 10 - offset)
               .attr("y", -2)
               .attr("width", 18)
               .attr("height", 10)
               .style("fill", this.colorLegendSilver)      


       
     }

     createChart(){
      
        console.log(this.margin.left + " bar -----top " + this.margin.top + "----width " + this.width + "---- " + this.height );
        var svgBar = d3.select("#barchart")
                    .append("svg")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("transform",
                            "translate(" + this.margin.left + "," + this.margin.top + ")");    
        
        return svgBar;  
    }


    

   

    drawChart(filteredData) {

 
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(filteredData, function(d){return(d.Country)}).keys()

         // Add X axis
       // var barwidth = this.width / groups.length;  //300; 
      
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, this.width])
            .padding([0.3]);

        this.xbarScale = x;       
        
        var xAxisBar = this.svgBar.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));


        
        xAxisBar.selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");  


            this.svgBar.append("g") 
            .attr("transform", "translate(220," + this.height  + ")") 
                .append("text")
                    .attr("class", "axis-title")
                    .attr("y", 40)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .attr("fill", "#5D6971")
                    .text("Country"); 


            this.svgBar.append("g") 
            .attr("transform", "translate(-50," + 8 + ")") 
                .append("text")
                    .attr("class", "axis-title")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .attr("fill", "#5D6971")
                    .text("Medals"); 
           
       // let subGroups = this.subGroups;    
        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(this.subGroups)
            .range(['#B0E0E6','#FF8C00','#EEF5DB'])
   

        var stackedData = d3.stack()
                .keys(this.subGroups)
                (filteredData);
        
        //console.log(stackedData);

        var maxVal =  d3.max(stackedData , function(d) {
            //console.log( "values " + d );
            return d3.max(d , function(dx) {
                return dx[1];
            });
        });

        var y = d3.scaleLinear()
            .domain([0, maxVal])//put max val here of medals
            .range([ this.height, 0 ]);

        this.ybarScale = y;    
  
        this.svgBar.append("g")
            .call(d3.axisLeft(y));
        
        
            
        // ----------------
        // Create a tooltip
        // ----------------
        var bartooltip = d3.select("#bartooltip")
            .style("opacity", 0)
            .attr("class", "tooltip");
        // .style("background-color", "white")
        // .style("border", "solid")
        // .style("border-width", "1px")
        // .style("border-radius", "5px")
        // .style("padding", "10px")
        //console.log("Came here 9");
        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            d3.selectAll(".myRect").style("opacity", 0.2)
            d3.selectAll("."+subgroupName)
      .             style("opacity", 1)
            bartooltip.transition()		
                        .duration(200)		
                        .style("opacity", .9);	
            bartooltip
                .html("Country: " + d.data['CountryName'] + "<br>" + subgroupName + "<br>" + "Value: " + subgroupValue)	 
                .style("left", (d3.event.pageX)+10 + "px") 
                .style("top", (d3.event.pageY)+10 + "px") 
        }
        // var mousemove = function(d) {
        //   bartooltip
        //     .style("left", (d3.event.pageX) + "px")	 // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        //     .style("top", (d3.event.pageY - 80) + "px");	
        // }
        var mouseleave = function(d) {
            d3.selectAll(".myRect")
                    .style("opacity",0.8)
            bartooltip
            .style("opacity", 0)
            // if (tooltip) tooltip.style('display', 'none');
        }
         // Show the bars
        this.svgBar.append("g")
            .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .attr("class", function(d){ return "myRect " + d.key })
            .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { 
        // console.log( "group data " + d.data.Country);
            return  x(d.data.Country); 
             })
            .attr("y", function(d) { return y(d[1]); 
            })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", mouseover)
            // .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
           //.on("mouseout" ,mouseleave)

    
    }

    updateScene(dateVal)
    {

     this.svgBar.selectAll("g").remove(); 
       this.filteredData = [];
      // console.log(this.data);
      var timeVal = this.parseTime( dateVal).getTime();
       this.filteredData =  this.data.filter(function(d){ 
        //console.log("Country : " + d.Country + " Total: " + d.GrandTotal +  " Bronze: " + d.Bronze);
        return ( /*d.GrandTotal > 90 &&*/ d.Year.getTime() == timeVal )});

        this.filteredData = this.filteredData .sort(function(b, a) {
            return a.GrandTotal - b.GrandTotal;
        }).slice(0, 20);//top 20 here;

        //console.log("bar data =>" ,this.filteredData) ;
        this.drawChart(this.filteredData);
     
    }
   

 };

