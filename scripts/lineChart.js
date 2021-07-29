


class LineChart{

    // width; height; lineSvg; margin;topCountryCount;
    // topCountries = [];
    // countryEnum;
    // xAxis; yAxis; xScale; yScale;
    // parseTime;
    // minMedals;
    // maxMedals;

    
    constructor(width, height , data , margin)
    {
        this.topCountries = ["USA" ,"GER" , "GBR", "CHN", "RUS", "KOR" , "ITA" , "AUS" ,"JPN", "FRA"];
        this.parseTime = d3.timeParse("%Y");
        this.bisectDate = d3.bisector(function(d) { return d.Year; }).left;
        this.width = width;
        this.height = height;
        this.data = data;
        this.data.forEach(element => {
            element.Year = this.parseTime((element.Year.trim()));
            element.GrandTotal = +element.GrandTotal;
            element.Country = element.Country.trim();
        }); 
        this.margin = margin;
        this.colorCode = d3.scaleOrdinal()
                        .domain(this.topCountries)
                        .range(d3.schemeCategory10); 
        this.topCountryCount = 10;//this.topCountries.length;
        this.lineSvg = this.createChart();
        this.createCountryLegend();
        this.createXAxis();
        this.createYAxis();
        this.maxMedals = 0;
        this.minMedals = 0;
    }

    //  Countries = {
    //     USA: "USA",
    //     GER: "GER",
    //     GBR: "GBR",
    //     CHN: "CHN",
    //     RUS: "RUS",
    //     KOR: "KOR",
    //     ITA: "ITA",
    //     AUS: "AUS"
    // }
    createYAxis()
    {
        this.yAxis =  this.lineSvg.append("g")
                            .attr("class", "axis axis--y")
                            .call(d3.axisLeft(this.yScale))
        this.lineSvg.append("g")  
                .append("text")
                    .attr("class", "axis-title")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .attr("fill", "#5D6971")
                    .text("Medals"); 
    }
    createXAxis()
    {
        //console.log("at start " +this.xScale); 
        this.xAxis = this.lineSvg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(this.xScale));

        this.lineSvg.append("g")       
            .append("text")
                .attr("class", "axis-title")
                .attr("x", this.width/2)
                .attr("y", this.height +30 )
                .attr("dx", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                .text("Year"); 

    }

    createCountryLegend() {
        var offset = 50;
        var eachSideoffset = this.topCountryCount/2 * offset;
        var perOffset = eachSideoffset*2 /  this.topCountryCount +6;
        for(var i = 0 ; i < this.topCountryCount ; i++)
        {
        this.lineSvg.append("circle")
           .attr("cx", (this.width / 2) + eachSideoffset)
            .attr("cy", -20).attr("r", 6)
            .style("fill", this.colorCode(this.topCountries[i]))
       
        this.lineSvg.append("text")
           .attr("x", (this.width / 2) + eachSideoffset+10)
            .attr("y", -20).text(this.topCountries[i])
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle")
            eachSideoffset -= perOffset;   
        }
       
    
    }

//     createFocusELeminLineChart(){
//        var focus =  this.lineSvg.append("g")
//         .attr("class", "focus")
//         .style("display", "none");

//         focus.append("line")
//         .attr("class", "x-hover-line hover-line")
//         .attr("y1", 0)
//         .attr("y2", this.height); 
        
//         focus.append("line")
//         .attr("class", "y-hover-line hover-line")
//         .attr("x1", this.width)
//         .attr("x2", this.width);

//         focus.append("circle")
//         .attr("r", 7.5);

//         focus.append("text")
//         .attr("x", 15)
//       	.attr("dy", ".31em");

//         var tipBox = this.lineSvg.append("rect")
//           .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
//           .attr("class", "overlay")
//           .attr("width", this.width)
//           .attr("height", this.height)
//           .on("mouseover", function() { focus.style("display", null); })
//           .on("mouseout", function() { focus.style("display", "none"); })
//           .on("mousemove", mousemove);
  
//         var medalsdata = this.topCountries['USA'];

//         medalsdata.map( record => {
//             let r = record;
//             var dataVal;
//             for(var i = 0 ; i < this.topCountryCount ; i++)
//             {
//                 dataVal = [];
//                 dataVal = this.topCountries[this.topCountries[i]].filter( function(b){
//                     return b.Year.getTime() == r.Year.getTime();
//                 } );
//                 if(dataVal.length > 0)
//                     r['medals_'+this.topCountries[i]] = dataVal[0]['GrandTotal'];
//                 else
//                    r['medals_'+this.topCountries[i]] = 0;
//             }    
//             return r
//           })

//           console.log("medalsData=>" , medalsdata);

       
//         var totalCountries = this.topCountryCount;
//         var totalCountriesData = this.topCountries;
//         var buildData = function(d) {
//             var builder = "";
//             var crlf = "\r\n";
//             for(var i = 0 ; i < totalCountries ; i++)
//             {
//                 builder += totalCountriesData[i]+ ":" + d['medals_'+totalCountriesData[i]] + " medals ";
//                 builder += crlf;
//             }
//             console.log(builder);
//             return builder;
//         }    

//         var xScale = this.xScale;
//         var yScale = this.yScale;
//         var bisectDate = this.bisectDate;
//         var height = this.height;
//         var width = this.width;

//         function mousemove() {
//          var x0 = xScale.invert(d3.mouse(tipBox.node())[0]),
//          //d3.mouse(this)[0]),
//                 i = bisectDate(medalsdata, x0, 1),
//                 d0 = medalsdata[i - 1],
 
//                 d1 = i < medalsdata.length ? medalsdata[i]: d0,
//                 d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
//        // console.log("d0=> " + d0 + " d1=> " + d1);        
//         focus.attr("transform", "translate(" + xScale(d.Year) + "," + yScale(d.GrandTotal) + ")");
//         focus.select("text").text(function() { return buildData(d) });
//         focus.select(".x-hover-line").attr("y2", height - yScale(d.GrandTotal));
//         focus.select(".y-hover-line").attr("x2", width + width);  

//     }
//   }

    createChart(){
      
        console.log(this.margin.left + " Line Chart -----top " + this.margin.top + "----width " + this.width + "---- " + this.height );

        //Add Legend for Countries

       


        var svgLine = d3.select("#linechart")
                    .append("svg")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("transform",
                            "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        this.yScale.domain([d3.min(this.data, function(d) 
            { return d.GrandTotal; }) , d3.max(this.data, function(d) { return d.GrandTotal; })]);

       
       
        this.xScale  = d3.scaleTime().range([0, this.width]);
        /*Year Domain for first world War */
        let domainVal = [this.parseTime(1890) ,this.parseTime(1918)  ]; 
        this.xScale.domain(domainVal);

        
        return svgLine;  
    }
    filterDataByCountry(countryCode ,startDate , endDate)
    {
       console.log("=>" + startDate ,  " endDate " + endDate);
        this.topCountries[countryCode] = [];
        this.topCountries[countryCode] =  this.data.filter(function(d){ 
                // console.log("Year : " + d.Year + " YearParam: " + startDate);
                // console.log("Year : " + d.Year + " YearParam: " + endDate);
                 return (d.Year >= startDate &&  d.Year <= endDate  && d.Country.trim() === countryCode.trim() //d.GrandTotal >20
                 );
     
             });

       // console.log("filtered Data : " + countryCode + " data=>" + this.topCountries[countryCode]);     


    }

 


    updateXAxisLineChart(xMin , xMax){
        this.xScale = d3.scaleTime()
                .domain([xMin, xMax])
                .range([0,this.width]);      
        this.xAxis.transition().duration(2000).call(d3.axisBottom(this.xScale ));
         
                 
    }
    updateYAxisLineChart(yMin , yMax){
        console.log(" yMin " +  yMin + " yMax " + yMax);
        this.yScale = d3.scaleLinear().domain([yMin, yMax]).range([this.height, 0]);
        this.yAxis.transition().duration(2000).call(d3.axisLeft(this.yScale));

        
    }
    drawChartLineforCountries(filteredData)
    {
        var CountryGroups = filteredData.map(d => d.Country);
        if(CountryGroups.length == 0)
           return;

        var myColor = d3.scaleOrdinal()
                        .domain(this.topCountries)
                        .range(d3.schemeCategory10);            
        // Define the line
        var xScaleLocal = this.xScale;
        var yScaleLocal = this.yScale;

        var valueline = d3.line()
                            .x(function(d) {
                                // console.log( "year  " + d.Year + " value " +  xScaleLocal(d.Year)); 
                            return xScaleLocal(d.Year); })
                            .y(function(d) { 
                               // console.log( "Total  " + d.GrandTotal + " value " +  yScaleLocal(d.Year)); 
                                return yScaleLocal(d.GrandTotal); });
       // Define the div for the tooltip
       var div = d3.select("#linechart").append("div")	
               .attr("class", "tooltip")				
                .style("opacity", 0);  
       
        // Add the valueline path.
        this.lineSvg.append("path")
            .datum(filteredData)
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke", function(d){ 
               // console.log("Country: " + CountryGroups[0] + " colorCode: " + myColor(CountryGroups[0].trim()));
                return myColor(CountryGroups[0].trim()) })   

        // Add the scatterplot
        // this.lineSvg.selectAll("dot")	
        //         .data(filteredData)			
        //         .enter().append("circle")								
        //         .attr("r", 5)		
        //         .attr("cx", function(d) { return x(d.Year); })		 
        //         .attr("cy", function(d) { return y(d.GrandTotal); })		
        //         .on("mouseover", function(d) {		
        //                 div.transition()		
        //                 .duration(200)		
        //                 .style("opacity", .9);		
        //         div.html(d.Year + "<br/>"  + d.GrandTotal)	
        //             .style("left", (d3.event.pageX) + "px")		
        //             .style("top", (d3.event.pageY - 28) + "px");	
        //  })					
        //        .on("mouseout", function(d) {		
        //          div.transition()		
        //          .duration(500)		
        //          .style("opacity", 0);	
        // });
 
    }

    updateScene(startdateVal , endDateVal)
    {
        //this.data = dataPass;
        //console.log(dataPass);
        // d3.select("path.line").remove();
        this.lineSvg.selectAll("path").remove();
      // this.lineSvg.
        this.minMedals = 1000000000;
        this.maxMedals = 0;
       //this.countryCode = .USA
       for(let i =0 ; i < this.topCountryCount ; i++)
       {
           // console.log("TopCountry " , this.topCountries[i]);
             this.filterDataByCountry(this.topCountries[i], this.parseTime(startdateVal) , this.parseTime(endDateVal));
             var MinMedals = d3.min(this.topCountries[this.topCountries[i]] , d=> d.GrandTotal);
             MinMedals = isNaN(MinMedals) ?  0 : MinMedals;
             this.minMedals = Math.min(this.minMedals , MinMedals);

             var MaxMedals = d3.max(this.topCountries[this.topCountries[i]] , d=> d.GrandTotal);
             MaxMedals = isNaN(MaxMedals) ?  0 : MaxMedals;
             this.maxMedals = Math.max(this.maxMedals ,MaxMedals);
            // console.log("Medals  " + this.minMedals + " max " + this.maxMedals );


       }
       this.updateXAxisLineChart(this.parseTime((startdateVal).toString())
                            , this.parseTime((endDateVal).toString()));
       this.updateYAxisLineChart(this.minMedals , this.maxMedals); 
       for(let i =0 ; i < this.topCountryCount ; i++)
       {
            this.drawChartLineforCountries(this.topCountries[this.topCountries[i]]);
       }

/////////Tool Tip code 
       var tooltip = d3.select('#tooltip');
       var tooltipLine = this.lineSvg.append('line');
       function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }
    
    //
        var medalsdata = this.topCountries['USA'];

        medalsdata.map( record => {
            let r = record;
            var dataVal;
            for(var i = 0 ; i < this.topCountryCount ; i++)
            {
                dataVal = [];
                dataVal = this.topCountries[this.topCountries[i]].filter( function(b){
                    return b.Year.getTime() == r.Year.getTime();
                } );
                if(dataVal.length > 0)
                    r['medals_'+this.topCountries[i]] = dataVal[0]['GrandTotal'];
                else
                   r['medals_'+this.topCountries[i]] = 0;
            }    
            return r
          })

        var totalCountries = this.topCountryCount;
        var totalCountriesData = this.topCountries;
        var buildData = function(d) {
            var builder = "";
            var crlf = "\r\n";
            for(var i = 0 ; i < totalCountries ; i++)
            {
                builder += totalCountriesData[i]+ ":" + d['medals_'+totalCountriesData[i]] + " medals ";
                builder += crlf;
                builder += crlf;
                
            }
           // console.log(builder);
            return builder;
        }       
    function getTooltipString(selectedData) {
        var stringContainingNewLines = buildData(selectedData);
        var htmlstring = stringContainingNewLines.replace(/(\r\n|\n|\r)/gm, "<br>");
            return "<p align='center'>" + (selectedData.Year).getFullYear() + "</p>" +
                "<table>" +
                htmlstring +
                // "<tr><td>Total Cases</td><td>" + selectedData.totalCases + "</td></tr>" +
                // "<tr><td>Total Deaths</td><td>" + selectedData.totalDeaths + "</td></tr>" +
                // "<tr><td>New Cases</td><td>" + selectedData.newCases + "</td></tr>" +
                // "<tr><td>New Deaths</td><td>" + selectedData.newDeaths + "</td></tr>" +
                "</table>";
        }      
    var xscaleChart = this.xScale, yScale = this.yScale;
    var height = this.height;
    function drawTooltip() {
        const hoverDate = xscaleChart.invert(d3.mouse(tipBox.node())[0]);
    
        tooltipLine.attr('stroke', 'black')
            .attr('x1', xscaleChart(hoverDate))
            .attr('x2', xscaleChart(hoverDate))
            .attr('y1', 0)
            .attr('y2', height);

         
        if (hoverDate < medalsdata[medalsdata.length - 1].Year 
            && hoverDate >= medalsdata[0].Year) {
            var bisect = d3.bisector(function(d) { return d.Year; }).left,

            
                 i = bisect(medalsdata, hoverDate, 1),
                 d0 = medalsdata[i - 1],
 
                 d1 = i < medalsdata.length ? medalsdata[i]: d0;
                 var selectedData = hoverDate - d0.Year > d1.Year - hoverDate ? d1 : d0;
            


            //var i = bisect(medalsdata, hoverDate, 1);
            //var selectedData = medalsdata[i];
            {
                tooltip.style("opacity", 0.8)
                    .style("display", "block")
                    .style("left", (d3.event.pageX) + 5 + "px")
                    .style("top", (d3.event.pageY) + 5 + "px")
                    .html(getTooltipString(selectedData));
            }
        } else {
            removeTooltip();
        }
    }
       //this.createFocusELeminLineChart();
       var tipBox = this.lineSvg.append('rect')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);


    }

};