


class LineChart{
    constructor(width, height , data , margin, colorSchemeRange)
    {
        this.domainOffSet = 30;
        this.colorSchemeRange = colorSchemeRange;
        this.topCountries = ["USA" ,"GER" , "GBR",  "RUS", "CHN", "AUS" ,"JPN", "FRA" , "GDR" , "FRG"];
        this.topCountriesName = ["USA" ,"Germany" , "UK",  "Russia", "China", "Australia" ,"Japan", "France" , "E-Germany" , "W-Germany"];
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
                        .range(this.colorSchemeRange); 
        this.topCountryCount = this.topCountries.length;;//this.topCountries.length;
        this.lineSvg = this.createChart();
        this.createCountryLegend();
        this.createXAxis();
        this.createYAxis();
        this.maxMedals = 0;
        this.minMedals = 0;
    }
    clearLineChartAnnotation()
    {
       
        let lineChart = this.lineSvg;
        lineChart.selectAll("#antCir").remove();
        lineChart.selectAll("#antPath").remove();
        lineChart.selectAll("#antText").remove();
     
        
    }

    annotateLineChart(x,y , ax, ay, textx, texty ,textVal )
    {
        console.log("annotateLineChart --");
        let lineChart = this.lineSvg;
        var xcoord = 0,
            ycoord = 0,
         x2coord = 0,
            y2coord = 0;

        let xscaleChart= this.xScale;
        let yscaleChart = this.yScale;
        let timeParse = this.parseTime;
    lineChart.append("circle")
        .transition().duration(900)
        .attr("id", "antCir")
        .style("opacity", "0.5")
        .style("border", "2px")
        .attr("cx", function() {
            xcoord = xscaleChart(timeParse(x));
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
    lineChart.append("line")
        .transition().duration(900)
        .attr("id", "antPath")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("x1", xcoord)
        .attr("y1", ycoord)
        .attr("x2", x2coord)
        .attr("y2", y2coord)

        lineChart.append("text")
        .transition().duration(900)
        .attr("id", "antText")
        .attr("x", x2coord + textx)
        .attr("y", y2coord + texty)
        .text(textVal);
    }
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
        var offset = 70;
        var eachSideoffset = this.topCountryCount/2 * offset;
        var perOffset = eachSideoffset*2 /  this.topCountryCount +6;
        for(var i = 0 ; i < this.topCountryCount ; i++)
        {

                this.lineSvg.append("circle")
           .attr("cx", (this.width / 2) + eachSideoffset)
            .attr("cy", -20).attr("r", 6)
            .style("fill", this.colorCode(this.topCountries[i]) ===undefined ?"#CC3399" : this.colorCode(this.topCountries[i])  );
       
        this.lineSvg.append("text")
           .attr("x", (this.width / 2) + eachSideoffset+10)
            .attr("y", -20).text(this.topCountriesName[i])
            .style("font-size", "8px")
            .attr("alignment-baseline", "middle");
            eachSideoffset -= perOffset;   
        }
       
       
    
    }


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
            { return d.GrandTotal; }) , d3.max(this.data, function(d) { return d.GrandTotal; }) + this.domainOffSet]);

       
       
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
        this.yScale = d3.scaleLinear().domain([yMin, yMax+ this.domainOffSet]).range([this.height, 0]);
        this.yAxis.transition().duration(2000).call(d3.axisLeft(this.yScale));

        
    }
    drawChartLineforCountries(filteredData)
    {
        var CountryGroups = filteredData.map(d => d.Country);
        if(CountryGroups.length == 0)
           return;

        var myColor = this.colorCode;          
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
   
       
        // Add the valueline path.
        this.lineSvg.append("path")
            .datum(filteredData)
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke", function(d){ 
                //console.log("Country: " + CountryGroups[0] + " colorCode: " + myColor(CountryGroups[0].trim()));
                var color = myColor(CountryGroups[0].trim() );
                color = (color === undefined) ? "#CC3399" : color;
                console.log("Country: " + CountryGroups[0] + " colorCode: " + color);
                return color});
               

       
    }

    updateScene(startdateVal , endDateVal)
    {
      
        this.lineSvg.selectAll("path").remove();

        this.minMedals = 1000000000;
        this.maxMedals = 0;
 
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
    

        const mySet1 = new Set();
        var medalsdata = [];
        for(var i = 0 ; i < this.topCountryCount ; i++)
        {
            for(var j =0 ; j < this.topCountries[this.topCountries[i]].length ; j++)
            {
                mySet1.add(this.topCountries[this.topCountries[i]][j]['Year'].getFullYear());
            }

        }
        for (let item of mySet1) {
            medalsdata.push(this.parseTime(item));
        }
        medalsdata = medalsdata.sort(function(b, a) {
            return b - a;
        });
        console.log("Medals length " + medalsdata.length);

        medalsdata.map( record => {
            let r = record;
            var dataVal;
            for(var i = 0 ; i < this.topCountryCount ; i++)
            {
                dataVal = [];
                dataVal = this.topCountries[this.topCountries[i]].filter( function(b){
                    return b.Year.getTime() == r.getTime();
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
        var totalCountryName = this.topCountriesName;
        var buildData = function(d) {
            var builder = "";
            var crlf = "\r\n";

            var sortData =[];
            for(var i = 0 ; i < totalCountries ; i++)
            {
                //builder += totalCountriesData[i]+ ":" + d['medals_'+totalCountriesData[i]] + " medals ";
                sortData.push({'Country': totalCountriesData[i] , 'CountryName': totalCountryName[i] , 'medals' : d['medals_'+totalCountriesData[i]] });
                
            }
            sortData.sort(function(b, a) {
                return a.medals - b.medals;
            });
            for(var i = 0 ; i < totalCountries ; i++)
            {
                builder += sortData[i].CountryName+ ": " + sortData[i].medals + " medals ";
                builder += crlf;
                builder += crlf;
                
            }
            return builder;
        }       
    function getTooltipString(selectedData) {
        var stringContainingNewLines = buildData(selectedData);
        var htmlstring = stringContainingNewLines.replace(/(\r\n|\n|\r)/gm, "<br>");
            return "<p align='center'>" + (selectedData).getFullYear() + "</p>" +
                "<table>" +
                htmlstring +
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

         
        if (hoverDate < medalsdata[medalsdata.length - 1] 
            && hoverDate >= medalsdata[0]) {
            var bisect = d3.bisector(function(d) { 
                //console.log("Here =>" + d.Year);
                return d; }).left,

            
                 i = bisect(medalsdata, hoverDate, 1),
                 d0 = medalsdata[i - 1],
 
                 d1 = i < medalsdata.length ? medalsdata[i]: d0;
                 var selectedData = hoverDate - d0 > d1 - hoverDate ? d1 : d0;

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

       var tipBox = this.lineSvg.append('rect')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);


    }

};