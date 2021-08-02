
var infoMap = [];
var coords = [];
var annotationPoints = [];
var currentSlide = 0;
var circleChart, barChart, lineChart;
var selectBarYear;
var dataVal=[];
var introjs;


function changeSceneforBar()
{
    selectBarYear
        .selectAll('option').remove();

    const  endDate =  coords[currentSlide].date;
    const  startDate = coords[currentSlide].x;
    arr = [];
 
       var datesData =  dataVal.filter(function(d) {  
          // console.log(" d=." , d);
            return (d.Year.getFullYear() >= startDate && d.Year.getFullYear() <= endDate); 
        });
       // console.log(" d=>" , datesData);
   
     for(var i = 0 ; i < datesData.length ; i++)
     {
         var elem = datesData[i]['Year'].getFullYear();
         //if(elem == 1972)
          // continue;
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

  selectValue = selectBarYear.property('value');


 barChart.updateScene(selectValue);
 barChart.clearBarChartAnnotation();
 circleChart.updateScene(selectValue,selectValue);

}
async function init() {
initInfoMap();
introjs = introJs();
//Drill Down per Country in the Quest , may be top 20
    //To do Imp
    var colorSchemeRange = ["#10b0ff","#70ae4f" , "#2f786e" ,
                            ,"#f25c58" , "#b7ff80","#a759c4" 
                            ,"#fec24c" ,"#875b44", "#7ed8fe"
                            , "#f00a1b", "#ff9ffb", "#afbff9"
                            ,"#a4a644" ,"#28c2b5", "#f68392"
                            ,, 
                            ];//["purple", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"];

    selectBarYear = d3.select("#barSelect");

    selectBarYear.on("change", changeBars);
    const  medalsData = await d3.csv("./resources/data/CSV-medals-History.csv");
    const CountryName = await d3.csv("./resources/data/noc_regions.csv");

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
    var lineChartmargin = {top: 30, right: 15, bottom: 30, left: 40};
    var chartHeight = chartHeight - lineChartmargin.top - lineChartmargin.bottom;
    

    var lineChartWidth = document.getElementById("linechart").offsetWidth  ;
  

    
     lineChart = new LineChart(lineChartWidth , chartHeight , dataVal , lineChartmargin, colorSchemeRange);
         
     
     //comment out for testing
   
      
    var paddingBetweenImages = 10; /*Padding between the images*/
    //lineChartmargin.top = 10 , lineChartmargin.bottom = 10 ,lineChartmargin.left = 10 ,lineChartmargin.right = 10 ;
    var barMargin = lineChartmargin;
    barMargin.bottom +=40;
    barMargin.left += 10;
    console.log("barWidth " , document.getElementById("barchart").offsetWidth);
    var barWidth = document.getElementById("barchart").offsetWidth ;
    //barMargin.top +=  paddingBetweenImages;


    
    barChart = new BarChart(barWidth , chartHeight ,dataVal, barMargin );
    var circleChartWidth = document.getElementById("contentChart").offsetWidth ;
  
    var cirCleChartMargin = lineChartmargin;
    cirCleChartMargin.top -= 10;
    cirCleChartMargin.left -= 20;

    circleChart = new TopChart(circleChartWidth, chartHeight +40, dataVal, cirCleChartMargin, colorSchemeRange);
    introjs.setOptions({
        showBullets: true,
        showProgress: true,
        exitOnOverlayClick: true,
        showStepNumbers: false,
        keyboardNavigation: true
    });
    introjs.start();
    sceneTrig(currentSlide);
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
    currentSlide = currentSlide - 1;
    currentValue = coords[currentSlide].date;
    update(coords[currentSlide].x , coords[currentSlide].date );
 
    infoUpdate(currentSlide);
    annotate();
    toggleSceneBtns();
}
function  nextTrig()
{
    clearAnnotation();
    introjs.hideHints();
    if (++currentSlide < coords.length) {

    } else {
        currentSlide = coords.length - 1;
        annotate();
    }
    update(coords[currentSlide].x , coords[currentSlide].date );
    annotate();
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
   } else {
    
       currentSlide = num;

       update(coords[currentSlide].x , coords[currentSlide].date);
       annotate();
   }
   toggleSceneBtns();
   infoUpdate(currentSlide);
   annotate();

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

  console.log("annotate" + currentSlide);

   lineChart.annotateLineChart(annotationPoints[currentSlide].x
                        , annotationPoints[currentSlide].y
                        , annotationPoints[currentSlide].ax
                         , annotationPoints[currentSlide].ay
                         , annotationPoints[currentSlide].textx
                         , annotationPoints[currentSlide].texty
                            ,annotationPoints[currentSlide].text );

if(annotationPoints[currentSlide].x0 != null)
{
    lineChart.annotateLineChart(annotationPoints[currentSlide].x0
        , annotationPoints[currentSlide].y0
        , annotationPoints[currentSlide].ax0
        , annotationPoints[currentSlide].ay0
        , annotationPoints[currentSlide].textx0
        , annotationPoints[currentSlide].texty0
            ,annotationPoints[currentSlide].text0 );
            
}

      if(annotationPoints[currentSlide].x1 != null)
      {
        lineChart.annotateLineChart(annotationPoints[currentSlide].x1
            , annotationPoints[currentSlide].y1
            , annotationPoints[currentSlide].ax1
             , annotationPoints[currentSlide].ay1
             , annotationPoints[currentSlide].textx1
             , annotationPoints[currentSlide].texty1
                ,annotationPoints[currentSlide].text1 );
      } 
      
      if(annotationPoints[currentSlide].x2 != null)
      {
        lineChart.annotateLineChart(annotationPoints[currentSlide].x2
            , annotationPoints[currentSlide].y2
            , annotationPoints[currentSlide].ax2
             , annotationPoints[currentSlide].ay2
             , annotationPoints[currentSlide].textx2
             , annotationPoints[currentSlide].texty2
                ,annotationPoints[currentSlide].text2 );
      } 
      
      if(annotationPoints[currentSlide].x3 != null)
      {
        lineChart.annotateLineChart(annotationPoints[currentSlide].x3
            , annotationPoints[currentSlide].y3
            , annotationPoints[currentSlide].ax3
             , annotationPoints[currentSlide].ay3
             , annotationPoints[currentSlide].textx3
             , annotationPoints[currentSlide].texty3
                ,annotationPoints[currentSlide].text3 );
      }  

      if(annotationPoints[currentSlide].x4 != null)
      {
        lineChart.annotateLineChart(annotationPoints[currentSlide].x4
            , annotationPoints[currentSlide].y4
            , annotationPoints[currentSlide].ax4
             , annotationPoints[currentSlide].ay4
             , annotationPoints[currentSlide].textx4
             , annotationPoints[currentSlide].texty4
                ,annotationPoints[currentSlide].text4 );
               
      }
      if(annotationPoints[currentSlide].Country4 != null)
      {

      barChart.annotateBarChart(annotationPoints[currentSlide].Country4
        , annotationPoints[currentSlide].y4
        ,annotationPoints[currentSlide].ax4
        ,annotationPoints[currentSlide].ay4
        ,annotationPoints[currentSlide].textx4
        ,annotationPoints[currentSlide].texty4
        ,annotationPoints[currentSlide].text4)
     }  
      if(annotationPoints[currentSlide].Country5 != null)
      {
       
                barChart.annotateBarChart(annotationPoints[currentSlide].Country5
                      , annotationPoints[currentSlide].y5
                      ,annotationPoints[currentSlide].ax5
                      ,annotationPoints[currentSlide].ay5
                      ,annotationPoints[currentSlide].textx5
                      ,annotationPoints[currentSlide].texty5
                      ,annotationPoints[currentSlide].text5)
      }  
      
      
    
}
function clearAnnotation() {
    lineChart.clearLineChartAnnotation();
    barChart.clearBarChartAnnotation();
}





function initInfoMap() {
    infoMap = [];
    //Pre First World War - Scene 0 //1896 - 1916
    infoMap.push({
        "data": "<h4>Pre-World War 1 </h4>"+"<h4>Year 1896 </h4><p>The first modern Olympics were held in Athens, Greece, in 1896. The Summer Olympics holds every 4 Years.</p>" +
        "<h4>Year 1896 - Year 1912</h4><p><i><u>The 1896 Olympics was dominated by Greece,</br> 1900 - France, 1904 - USA, </br> 1908 - Great Britain , 1912 - Sweden </u></i></p>" +
            "<h4>1916 Summer Olympics Cancelled</h4><p>At the outbreak of World War I in 1914, organization continued as no one expected that the war would continue for several years.The scheduled The scheduled 1916 Summer Olympics were cancelled .</p>"
    });
    //Post First World War - Scene 1 //1920 - 1936 
    infoMap.push({
        "data": 
        "<h4>Post-World War 1 </h4>"+"<h4>Year 1920 — Post World War1 Olympics</h4><p>The Summer Olympics held in 1920 in Antwerp, Belgium. The United States won the most gold and overall medals.</p>" +
        "<h4>Year 1920  - Year 1936</h4><p><i><u>The 1929 - 1932 Summer Olympics was dominated by Unites States, </br> 1936 Germany lead the race of most Olympic Medals </u></i></p>" +
            "<h4>The 1928 Summer Olympics </h4><p>The United States won the most gold and overall medals..</p>"+"<h4>Year 1936 </h4><p>Year 1932 Los Angeles games were affected by the Great Depression.The 1936 Berlin Games were seen by the German government as a golden opportunity to promote their ideology. The ruling Nazi Party commissioned film-maker Leni Riefenstahl to film the games. The result, Olympia, was widely considered to be a masterpiece, despite Hitler's theories of Aryan racial superiority being repeatedly shown up by non-Aryan athletes.</p>" +
            "<p> <b> In particular, African-American sprinter and long jumper Jesse Owens won four gold medals. The 1936 Berlin Games also saw the introduction of the Torch Relay </b> </p>"
    });
    //Pre Second World War - Scene 2- 1940 - 1972
    infoMap.push({
        "data": 
        "<h4>World War 2 Period  </h4>"+"<h4>Year 1940 to Year 1972 ,</br> 1940 - 1947 World War II period </h4><p>Due to World War II, the Games of 1940 (due to be held in Tokyo and temporarily relocated to Helsinki upon the outbreak of war) were cancelled. The Games of 1944 were due to be held in London but were also cancelled</p>"+
            "<h4> 1949 -1990 </h4> <p> <b> GDR: German Democratic Republic</br>FRG:  West Germany  </b></br> are officially the Federal Republic of Germany formed after the second World War defeat. </br> It remained like that till 1990 when the United Germany is formed</p>"+
            "<h4>Year 1948-1972. </h4><p> Year 1948 to 1972 ,USA Tops the chart of total medals. </br> The 1968 Games also introduced the now-universal Fosbury flop, a technique which won American high jumper Dick Fosbury the gold medal. In the medal award ceremony for the men's 200 meter race, black American athletes Tommie Smith (gold) and John Carlos (bronze) took a stand for civil rights by raising their black-gloved fists and wearing black socks in lieu of shoes. They were banned by the IOC..</p>"+
            "<h4>1972</h4> <p> GDR(East Germany ) performance in Olympics improved as per the line Graph just falling behind United States </p>"
    });
    //Post Second World War - Scene 4 //1976 -1992 Olympics 
    infoMap.push({
        "data": "<h4>Post World War 2 Period  </h4>"+"<h4>Year 1976 -1992 </h4><p>The 1976 Montreal Games were marred by an African boycott involving 22 countries. The boycott was organised by Tanzania to protest the fact that the New Zealand rugby team had toured Apartheid South Africa and that New Zealand was scheduled to compete in the Olympic Games.</p>" +
        "</br> <h4>Year 1980. </h4> <p> <b><i>The 1980 Summer Olympics boycott was one part of a number of actions initiated by the United States to protest against the Soviet invasion of Afghanistan.</i></b> The Soviet Union, which hosted the 1980 Summer Olympics, and its allies would later boycott the 1984 Summer Olympics in Los Angeles</p>"+  
            "</br>  <h4>Year 1992.</h4> <p>The 1992 Barcelona Games featured the admittance of players from one of the North American top leagues, the NBA, exemplified by but not limited to US basketball's -Dream Team. The 1992 games also saw the reintroduction to the Games of several smaller European states which had been incorporated into the Soviet Union since World War II. At these games, gymnast Vitaly Scherbo set an inaugural medal record of five individual gold medals at a Summer Olympics, and equaled the inaugural record set by Eric Heiden at the 1980 Winter Olympics.</p>"
    });
    //Post Second World War - Scene 5 //1996 -2012 Olympics 
    infoMap.push({
        "data": "<h4>Modern Day Olympics </h4>"+"<h4>Year 1996. </h4><p>At the Atlanta 1996 Summer Olympics, the highlight was 200 meters runner Michael Johnson annihilating the world record in front of a home crowd.</p>" +
        "<h4>Year 2008.</h4><p>American swimmer Michael Phelps won a total of eight gold medals, more than any other athlete in a single Olympic Games, setting numerous world and Olympic records in the process</p>"+
        "<h4>Year 2012. </h4><p>The United States returned to the top of the medal table after China dominated in 2008..</p>"
    });

    coords.push({
        "x": "1896",
        "date": "1916",
    });
    coords.push({
        "x": "1920",
        "date": "1936",
    });
    coords.push({
        "x": "1940",
        "date": "1972",
    });
    coords.push({
        "x": "1976",
        "date": "1992",
    });
    coords.push({
        "x": "1996",
        "date": "2012",
    });
///

annotationPoints.push({ //scene1 
        "x": "1900",
        "date": "1900",
        "y": 185,
        "ax": 0,
        "ay": -20,
        "text": "France Winning most medals till 1900",
        "textx": -50,
        "texty": 0,
        "x0": "1900",
        "date0": "1900",
        "y0": 55,
        "ax0": 0,
        "ay0": -40,
        "text0": "USA number 3 in medal List in 1900",
        "textx0": -50,
        "texty0": 0,
        "x1": "1904",
        "date2": "1904",
        "y1": 390,
        "ax1": 80,
        "ay1": -20,
        "text1": "USA won most medals",
        "textx1": 0,
        "texty1": 0,
        "x2": "1908",
        "date2": "1908",
        "y2": 348,
        "ax2": 20,
        "ay2": -20,
        "text2": "USA trailing, UK in top till 1912",
        "textx2": -40,
        "texty2": 0,
        "x3": "1915",
        "date3": "1916",
        "y3": 20,
        "ax3": 0,
        "ay3": -220,
        "text3": "World War1-1916 Olympics Cancelled",
        "textx3": -215,
        "texty3": -10,
        "Barchart": "yes",
       "Country4": "GRE",
        "y4": 53,
        "ax4": 40,
        "ay4": 60,
        "text4": "Most medals for Greece",
        "textx4": 2, 
        "texty4": 20,
        "Country5": "USA",
        "y5": 20,
        "ax5": 40,
        "ay5": 60,
        "text5": "USA In 3rd Position",
        "textx5": 0,
        "texty5": 10

    });
    annotationPoints.push({//scene2 
        "x": "1936",
        "date": "1936",
        "y": 210,
        "ax": -70,
        "ay": 0,
        "text": "Germany finished in the Top Position",
        "textx": -240,
        "texty": 0,
        "x1": "1936",
        "date2": "1936",
        "y1": 92,
        "ax1": -90,
        "ay1": 0,
        "text1": "USA in second Position",
        "textx1": -200,
        "texty1": 0,
        "Barchart": "yes",
       "Country4": "USA",
        "y4": 193,
        "ax4": 40,
        "ay4": 60,
        "text4": "Most medals for USA",
        "textx4": 2, 
        "texty4": 20,
       
      
    });
    annotationPoints.push({//scene3
        "x": "1960",
        "date": "1960",
        "y": 120,
        "ax": 0,
        "ay": -80,
        "text": "Post World War-2 USA leading 5 years Olympics",
        "textx": -280,
        "texty": 0,
        "x": "1945",
        "date": "1945",
        "y": 10,
        "ax": 0,
        "ay": -140,
        "text": "World War-2 till 1947, Olympics Cancelled",
        "textx": -100,
        "texty": 0,
        "x1": "1972",
        "date2": "1972",
        "y1": 148,
        "ax1": 0,
        "ay1": -40,
        "text1": "Germany finished just behind USA",
        "textx1": -220,
        "texty1": 0,
        "Barchart": "yes",
        "Country4": "USA",
         "y4": 145,
         "ax4": 40,
         "ay4": 60,
         "text4": "USA most medals",
         "textx4": 2, 
         "texty4": 20,
    });
    annotationPoints.push({//scene4
        "x": "1980",
        "date": "1980",
        "y": 260,
        "ax": 0,
        "ay": 80,
        "text": "W-Germany won the most medals, USA did not participate",
        "textx": -160,
        "texty": 20,
        "x1": "1990",
        "date2": "1990",
        "y1": 210,
        "ax1": 0,
        "ay1": -60,
        "text1": "USA Leading for 4 years straight",
        "textx1": -180,
        "texty1": -10,
        "x2": "1908",
        "date2": "1908",
        "y2": 348,
        "ax2": 20,
        "ay2": -20,
        "text2": "Decline in medals of USA, UK picking up",
        "textx2": 0,
        "texty2": 0,
        "x3": "1915",
        "date3": "1916",
        "y3": 80,
        "ax3": 0,
        "ay3": -180,
        "text3": "World War1-1916 Olympics Cancelled",
        "textx3": -220,
        "texty3": -20,
        "Barchart": "yes",
        "Country4": "GDR",
         "y4": 260,
         "ax4": 40,
         "ay4": 60,
         "text4": "Most medals for Germany",
         "textx4": -20, 
         "texty4": 20,
    });
    annotationPoints.push({//scene5
        "x": "2008",
        "date": "2008",
        "y": 185,
        "ax": 0,
        "ay": -30,
        "text": "China emerged as best performer just after USA",
        "textx": -150,
        "texty": -10,
        "x1": "2011",
        "date2": "2011",
        "y1": 270,
        "ax1": 0,
        "ay1": -40,
        "text1": "USA finished in top in 5 Olympics",
        "textx1": -240,
        "texty1": -10,
        "Barchart": "yes",
        "Country4": "USA",
         "y4": 260,
         "ax4": 40,
         "ay4": 60,
         "text4": "USA Back to the top",
         "textx4": 2, 
         "texty4": 20,
    });
   
}

