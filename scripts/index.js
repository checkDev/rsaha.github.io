
var infoMap = [];
var coords = [];
var currentSlide = 0;
var circleChart, barChart, lineChart;
var selectBarYear;
var dataVal=[];
//var dataPass=[];

function changeSceneforBar()
{
    selectBarYear
        .selectAll('option').remove();

    const  endDate =  coords[currentSlide].date;
    const  startDate = coords[currentSlide].x;
    arr = [];
 
       var datesData =  dataVal.filter(function(d) {  
           //console.log(" d=." , d);
            return (d.Year.getFullYear() >= startDate && d.Year.getFullYear() <= endDate); 
        });
       // console.log(" d=>" , datesData);
   
     for(var i = 0 ; i < datesData.length ; i++)
     {
         var elem = datesData[i]['Year'].getFullYear();
         if(i==0)
          arr.push(elem);
          else if(arr[arr.length-1] != elem)
          arr.push(elem);

     }

    var options = selectBarYear
        .selectAll('option')
	    .data(arr).enter()
	    .append('option')
		.text(function (d) { return d; });
   return arr;
  
}
function changeBars(){
   // alert("select changed");
  // const  endDate =  coords[currentSlide].date;
  // const  startDate = coords[currentSlide].x;
  // console.log("Year =>" ,selectBarYear.node().value);
  // barChart.updateScene(selectBarYear.node().value);
  selectValue = selectBarYear.property('value');

 // alert(selectValue);
 barChart.updateScene(selectValue);
 circleChart.updateScene(selectValue,selectValue);

}
async function init() {
initInfoMap();

    selectBarYear = d3.select("#barSelect");

    selectBarYear.on("change", changeBars);
    var medalsData = await d3.csv("../resources/data/CSV-medals-History.csv");
    const CountryName = await d3.csv("../resources/data/noc_regions.csv");

    medalsData.map( record => {
        let r = record;
        var dataVal;
        dataVal = [];
        dataVal = CountryName.filter( function(b){
            return b.NOC.trim() === r.Country.trim();
        } );
        if(dataVal.length > 0)
            r['CountryName'] = dataVal[0]['region'];
        else
           r['CountryName'] = ""    
        return r
      })
     dataVal =[]
     dataVal = medalsData;

    chartHeight = 400;
    var lineChartmargin = {top: 40, right: 30, bottom: 40, left: 30};
    var chartHeight = chartHeight - lineChartmargin.top - lineChartmargin.bottom;
    

    var lineChartWidth = document.getElementById("linechart").offsetWidth - lineChartmargin.left - lineChartmargin.right ;
  

    //Drill Down per Country in the Quest , may be top 20
    //To do Imp
     lineChart = new LineChart(lineChartWidth , chartHeight , dataVal , lineChartmargin);
         
     
     //comment out for testing
   
      
    var paddingBetweenImages = 10; /*Padding between the images*/
    var barMargin = lineChartmargin;
    //barMargin.left;
    console.log("barWidth " , document.getElementById("barchart").offsetWidth);
    var barWidth = document.getElementById("barchart").offsetWidth - barMargin.left - barMargin.right;
    //barMargin.top +=  paddingBetweenImages;


    
    barChart = new BarChart(barWidth , chartHeight ,dataVal, barMargin );
    var circleChartWidth = document.getElementById("contentChart").offsetWidth - lineChartmargin.left - lineChartmargin.right ;
  
    var cirCleChartMargin = lineChartmargin;
   // cirCleChartMargin.top = 0,cirCleChartMargin.left = 0,cirCleChartMargin.right = 0, cirCleChartMargin.bottom =0;
    circleChart = new TopChart(circleChartWidth, chartHeight, dataVal, cirCleChartMargin);

    // barChart.updateScene(2000);

    
  
    // var contentChartWidth = document.getElementById("contentChart").offsetWidth - margin.left - margin.right;
    //  topChart = new TopChart( contentChartWidth , chartHeight ,dataVal, margin  );
    //  topChart.updateScene(2010); //put date value

    sceneTrig(0);
}

function update(dateStartIncl , dateEndIncl){
    var optionsAdded = changeSceneforBar(sceneNum);
    lineChart.updateScene(dateStartIncl, dateEndIncl);
    if(optionsAdded.length > 0)
    {
     barChart.updateScene(optionsAdded[0]);
     circleChart.updateScene(optionsAdded[0], optionsAdded[0]);
    }
   
}



function  prevTrig()
{
    clearAnnotation();
    console.log("currentSlide:" + currentSlide);
    //console.log("currentSlide det:" + coords[currentSlide]);
    currentSlide = currentSlide - 1;
    currentValue = coords[currentSlide].date;//xsl(timeParse(coords[currentSlide].date));
    update(coords[currentSlide].x , coords[currentSlide].date );
    //update(timeParse(coords[currentSlide].date));
    /* if (currentSlide > 0 && currentSlide < coords.length - 1) {
        document.getElementById("prev-button").disabled = false;
    } else {
        document.getElementById("prev-button").disabled = true;
        document.getElementById("next-button").disabled = false;
        currentSlide = 0;
    } */
    infoUpdate(currentSlide);
    annotate();
    toggleSceneBtns();
}
function  nextTrig()
{
   // clearAnnotation();
    //intro.hideHints();
    if (++currentSlide < coords.length) {
       // navTimer = setInterval(moveForward, 50);
    } else {
        currentSlide = coords.length - 1;
        annotate();
        //document.getElementById("next-button").disabled = true;
    }
    //annotate();
    toggleSceneBtns();
    infoUpdate(currentSlide);
}


function sceneTrig(num)
{

   sceneNum = num;
   clearAnnotation();
   console.log("Scenbutton selected: " + num);
  
   if (currentSlide < num) {
       currentSlide = num;
       update(coords[currentSlide].x , coords[currentSlide].date);
       annotate();
       //navTimer = setInterval(moveForward, 50);
   } else {
    
       currentSlide = num;
      // console.log("Scenbutton selected test : " + coords[currentSlide]);
       //currentValue = xsl(timeParse(coords[currentSlide].date));
       //update(timeParse(coords[currentSlide].date));
       update(coords[currentSlide].x , coords[currentSlide].date);
       annotate();
   }
   toggleSceneBtns();
   infoUpdate(currentSlide);

}

function infoUpdate() {

    d3.select("#infoScene")
        .html(infoMap[currentSlide].data);
    
}
//Disable this Button and Enable Other Button
function toggleSceneBtns() {
    //console.log("currentSlide:" + currentSlide + " maxSlides:" + coords.length);
    for (var i = 0; i < coords.length; i++) {
        //console.log("toggleSceneBtns -- page_" +  i );
        document.getElementById("page_" + i).disabled = false;
    }
    document.getElementById("page_" + currentSlide).disabled = true;

    if (currentSlide >= coords.length - 1) {
        document.getElementById("next_Button").disabled = true;
    } else {
        document.getElementById("next_Button").disabled = false;
    }

    if (currentSlide > 0 && currentSlide <= coords.length - 1) {
        document.getElementById("prev_Button").disabled = false;
    } else {
        document.getElementById("prev_Button").disabled = true;
    }
}
function annotate() {

}
function clearAnnotation() {
    // chartSVG.selectAll("#antCir").remove();
    // chartSVG.selectAll("#antPath").remove();
    // chartSVG.selectAll("#antText").remove();
    // barsvg.selectAll("#antCir").remove();
    // barsvg.selectAll("#antPath").remove();
    // barsvg.selectAll("#antText").remove();
}





function initInfoMap() {
    infoMap = [];
    //Pre First World War - Scene 0 //1896 - 1916
    infoMap.push({
        "data": "<h4>Year 1896</h4><p>The first modern Olympics were held in Athens, Greece, in 1896. The man responsible for its rebirth was a Frenchman named Baron Pierre de Coubertin, who presented the idea in 1894.</p>" +
            "<h4>1916 Summer Olympics Cancelled</h4><p>At the outbreak of World War I in 1914, organization continued as no one expected that the war would continue for several years.The scheduled The scheduled 1916 Summer Olympics were cancelled .</p>"
    });
    //Post First World War - Scene 1 //1920 - 1928 
    infoMap.push({
        "data": "<h4>Year 1920 — Post World War1 Olympics</h4><p>The Summer Olympics held in 1920 in Antwerp, Belgium. The United States won the most gold and overall medals.</p>" +
            "<h4>The 1928 Summer Olympics </h4><p>The United States won the most gold and overall medals..</p>"
    });
    //Pre Second World War - Scene 2- 1936 - 1940
    infoMap.push({
        "data": "<h4>Year 1936 </h4><p>Year 1932 Los Angeles games were affected by the Great Depression.The 1936 Berlin Games were seen by the German government as a golden opportunity to promote their ideology. The ruling Nazi Party commissioned film-maker Leni Riefenstahl to film the games. The result, Olympia, was widely considered to be a masterpiece, despite Hitler's theories of Aryan racial superiority being repeatedly shown up by non-Aryan athletes.</p>" +
            "<p> <b> In particular, African-American sprinter and long jumper Jesse Owens won four gold medals. The 1936 Berlin Games also saw the introduction of the Torch Relay </b> </p>"+
            "<h4>Year 1940 to Year 1944 </h4><p>Due to World War II, the Games of 1940 (due to be held in Tokyo and temporarily relocated to Helsinki upon the outbreak of war) were cancelled. The Games of 1944 were due to be held in London but were also cancelled</p>"
    });
    //Post Second World War - Scene 3 //1948 - 1972 , 1964 Olympics gaining polularity
    infoMap.push({
        "data": "<h4>Year 1948. </h4><p> The 1968 Games also introduced the now-universal Fosbury flop, a technique which won American high jumper Dick Fosbury the gold medal. In the medal award ceremony for the men's 200 meter race, black American athletes Tommie Smith (gold) and John Carlos (bronze) took a stand for civil rights by raising their black-gloved fists and wearing black socks in lieu of shoes. They were banned by the IOC..</p>" +
            "<h4>Year 1972. </h4><p>Some memorable athletic achievements did occur during these Games, notably the winning of a then-record seven gold medals by United States swimmer Mark Spitz, Lasse Virén (of Finland)'s back-to-back gold in the 5,000 meters and 10,000 meters, and the winning of three gold medals by Soviet gymnastic star Olga Korbut - who achieved a historic backflip off the high bar. Korbut, however, failed to win the all-around, losing to her teammate Ludmilla Tourischeva. </p>"
    });
    //Post Second World War - Scene 4 //1976 -1984 Olympics 
    infoMap.push({
        "data": "<h4>Year 1976. </h4><p>. The Montreal Games were the most expensive in Olympic history, until the 2014 Winter Olympics, costing over $5 billion (equivalent to $22.03 billion in 2020)..</p>" +
            "<h4>Year 1992.</h4> <p>The 1992 Barcelona Games featured the admittance of players from one of the North American top leagues, the NBA, exemplified by but not limited to US basketball's -Dream Team. The 1992 games also saw the reintroduction to the Games of several smaller European states which had been incorporated into the Soviet Union since World War II. At these games, gymnast Vitaly Scherbo set an inaugural medal record of five individual gold medals at a Summer Olympics, and equaled the inaugural record set by Eric Heiden at the 1980 Winter Olympics.</p>"
    });
    //Post Second World War - Scene 5 //1996 -2012 Olympics 
    infoMap.push({
        "data": "<h4>Year 1996. </h4><p>At the Atlanta 1996 Summer Olympics, the highlight was 200 meters runner Michael Johnson annihilating the world record in front of a home crowd. . </p>" +
            "<h4>Year 2012. </h4><p>The United States returned to the top of the medal table after China dominated in 2008..</p>"
    });

    coords.push({
        "x": "1896",
        "date": "1916",
        "y": 1,
        "ax": 50,
        "ay": -150,
        "text": "1st Confirmed Case in the US",
        "textx": 0,
        "texty": 0
    });
    coords.push({
        "x": "1920",
        "date": "1928",
        "y": 1,
        "ax": 90,
        "ay": -150,
        "text": "1st death in the US",
        "textx": 0,
        "texty": 0
    });
    coords.push({
        "x": "1936",
        "date": "1948",
        "y": 351,
        "ax": 90,
        "ay": -150,
        "text": "National Emergency declared",
        "textx": 0,
        "texty": 0,
        "bartext": "NY - Epicenter of the Pandemic",
        "state": "New York",
        "cases": 33117,
    });
    coords.push({
        "x": "1949",
        "date": "1972",
        "y": 4928,
        "ax": 90,
        "ay": -150,
        "text": "Max deaths in one day",
        "textx": 0,
        "texty": 0
    });
    coords.push({
        "x": "1976",
        "date": "1992",
        "y": 19807,
        "ax": 50,
        "ay": -150,
        "text": "Stay-at-home order lifted",
        "textx": 0,
        "texty": 0
    });
    coords.push({
        "x": "1996",
        "date": "2012",
        "y": 78427,
        "ax": -150,
        "ay": 50,
        "text": "Max cases in one day",
        "textx": -100,
        "texty": 20,
        "state": "California",
        "cases": 487855,
        "bartext": "California becomes the most infected state"
    });
}

