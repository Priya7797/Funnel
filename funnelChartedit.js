(function()  {
	let _series1Color;
	let _chartTitle;
	let _chartTitleFontSize;
	let _statusCheckBox;
	let _legendValue;
	let _radioValue;
	let _radioPercent;
	let _radioCombination;
	const amchartscorejs = "https://cdn.amcharts.com/lib/4/core.js";
	const amchartschartsjs = "https://cdn.amcharts.com/lib/4/charts.js";
	const amchartsanimatedjs = "https://cdn.amcharts.com/lib/4/themes/animated.js"


    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
<div id="chartTitle" style=""></div><br/>
<div id="chartdiv"></div>
    `;
	
function loadScript(src) {
		return new Promise(function(resolve, reject) {
			let script = document.createElement('script');
			script.src = src;

			script.onload = () => {
				resolve(script);
			}
			script.onerror = () => reject(new Error(`Script load error for ${src}`));

			document.head.appendChild(script)
		});
	}	

    customElements.define('com-sap-sample-funnelchart', class WidgetTemplate extends HTMLElement {


		constructor() {
			super(); 
		
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(tmpl.content.cloneNode(true));					
			this._props = {};
			this._firstConnection = 0;
		}


        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
			
            if (this._firstConnection === 0) {
				async function LoadLibs(that) {
					try {
						await loadScript(amchartscorejs);
						await loadScript(amchartschartsjs);
						await loadScript(amchartsanimatedjs);
					} catch (e) {
						console.log(e);
					} finally {
						that._firstConnection = 1;
						that.loadthis();
					}
				}
				LoadLibs(this);
			}
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){
        
        }
		onCustomWidgetBeforeUpdate(changedProperties) {
				this._props = { ...this._props, ...changedProperties };
			}

			onCustomWidgetAfterUpdate(changedProperties) {
				if ("color" in changedProperties) {
					this._series1Color = changedProperties["color"];
				}
				if ("title" in changedProperties) {
					this._chartTitle = changedProperties["title"];
				}
				if ("titlefontsize" in changedProperties) {
					this._chartTitleFontSize = changedProperties["titlefontsize"];
				}
				if ("statusCheckBox" in changedProperties) {
					this._statusCheckBox = changedProperties["statusCheckBox"];
				}
				if ("legendvalue" in changedProperties) {
					this._legendValue = changedProperties["legendvalue"];
				}
				if ("radiovalue" in changedProperties) {
					this._radioValue = changedProperties["radiovalue"];
				}
				if ("radiopercent" in changedProperties) {
					this._radioPercent = changedProperties["radiopercent"];
				}
				if ("radiocombination" in changedProperties) {
					this._radioCombination = changedProperties["radiocombination"];
				}
				if (this._firstConnection === 1) {
					this.loadthis();
				}
			}

		onCustomWidgetResize(width, height){
			if (this._firstConnection === 1) {
				this.loadthis();
			}
        }
		
        
        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }

        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
        
        }
        */

        loadthis(){
			
			let myChart = this.shadowRoot.getElementById('chartdiv');
			myChart.style.height = this.shadowRoot.host.clientHeight - 20 + "px";
			myChart.style.width = this.shadowRoot.host.clientWidth - 20 + "px";
		
			if(this._chartTitle && this._chartTitle.trim() !== "") {
				var chartTitle = this.shadowRoot.getElementById('chartTitle');
				chartTitle.innerText = this._chartTitle.trim();
				if(this._chartTitleFontSize && this._chartTitleFontSize > 0) {
					chartTitle.style.fontSize = this._chartTitleFontSize + "px";
				}
				myChart.style.height = myChart.clientHeight - chartTitle.clientHeight - 10 + "px";
				myChart.style.top = chartTitle.clientHeight - 10 + "px"; 
			}
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart
var chart = am4core.create(myChart, am4charts.SlicedChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

if(this.datasourceString.trim() === "{}") { 

  chart.data = [{
    "name": "Stage #1",
    "value": 600
  }, {
    "name": "Stage #2",
    "value": 300
  }, {
    "name": "Stage #3",
    "value": 60
  }, {
    "name": "Stage #4",
    "value": 180
  }, {
    "name": "Stage #5",
    "value": 50
  }, {
    "name": "Stage #6",
    "value": 20
  }, {
    "name": "Stage #7",
    "value": 10
  }];


}

else {
				var newDataSourceObj = JSON.parse(this.datasourceString);
				var newChartData = [];
				for(var i = 0; i < newDataSourceObj.length; i++) {
					var dimMemberID = newDataSourceObj[i].dimensions[0].member_id;
					var dimMemberDesc = newDataSourceObj[i].dimensions[0].member_description;
					var msrObj = newDataSourceObj[i].measure;
					if(!newChartData.find(x => x.category_id === dimMemberID)) {
						var newDataObject = {};
						newDataObject.category_id = dimMemberID;
						newDataObject.name = dimMemberDesc;
					/*	newDataObject.measuredescriptions = [];
						newDataObject.measuredescriptions.push(msrObj.measure_description);*/
						newDataObject.value = msrObj.formattedValue;
						newChartData.push(newDataObject);
					} else {
						var existingObj = newChartData.find(x => x.category_id === dimMemberID);
					/*	existingObj.measuredescriptions.push(msrObj.measure_description);
						var newProp = "value"+existingObj.measuredescriptions.length;*/
						existingObj[newProp] = msrObj.formattedValue;
					}
					
				}
				chart.data = newChartData;
				

}
		
		
var seriesColors = this._series1Color.split(";");
for (i = 0; i < seriesColors.length; i++) {
	seriesColors[i] = am4core.color(seriesColors[i]);
}
console.log(seriesColors);
		
		

let series = chart.series.push(new am4charts.FunnelSeries());
series.dataFields.value = "value";
series.dataFields.category = "name";
series.colors.list = seriesColors;

var fillModifier = new am4core.LinearGradientModifier();
fillModifier.brightnesses = [-0.5, 1, -0.5];
fillModifier.offsets = [0, 0.5, 1];
series.slices.template.fillModifier = fillModifier;
series.alignLabels = true;

series.legendSettings.labelText = "{category}";
//series.labels.template.text = "{category}: [bold]{value}[/]";
if(this._statusCheckBox == true){
	chart.legend = new am4charts.Legend();
	chart.legend.position = "left";
	chart.legend.valign = "bottom";
	chart.legend.margin(5,5,20,5);
	chart.legend.fontSize = 10;
	var markerTemplate = chart.legend.markers.template;
	markerTemplate.width = 10;
	markerTemplate.height = 10;
	//chart.legend.maxHeight = 50;
	chart.legend.scrollable = true;
	chart.legend.labels.template.text = "{category}";
	}
/*chart.legend = new am4charts.Legend();
chart.legend.position = "left";
chart.legend.valign = "bottom";
chart.legend.margin(5,5,20,5);*/

if(this._legendValue == false){
	series.ticks.template.disabled = true;
	series.alignLabels = false;
	//series.labels.template.relativeRotation = 90;
	//series.labels.template.radius = am4core.percent(-50);
	//series.labels.template.fill = am4core.color("white");
	//series.labels.template.fontSize = 11;
	//series.labels.template.maxWidth = 60	
}

if(this._radioValue == true){
	series.labels.template.text = "{category}: [bold]{value}[/]";
}

	else if(this._radioPercent == true)
		{
			series.labels.template.text = "{category}: [bold]{value.percent.formatNumber('#.0')}%";
		}
	else if(this._radioCombination == true){
		series.labels.template.text = "{category}: [bold]{value.percent.formatNumber('#.0')}% ({value})";
		}
	else
	{
		series.labels.template.text = "{category}: [bold]{value.percent.formatNumber('#.0')}%";

	}

//sorted order of funnel chart
function compare( a, b ) {
	let value1 = parseFloat(a.value);
	let value2 = parseFloat(b.value);

	if ( value1 > value2 ){
	  return -1;
	}
	if ( value1 < value2 ){
	  return 1;
	}
	return 0;
  }
  
  chart.data.sort(compare)
  console.log("Chart Data after sorting");
  console.log(chart.data);
// end am4core.ready()
        }	
    
    });
        
})();
