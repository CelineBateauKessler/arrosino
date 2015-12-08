$(document).ready(function(){

	console.log("Doc loaded");

		$.ajax({
			url: 'getRawSensor.php',
			type: 'GET'
		})
		.done(function(reponse) {
			console.log("REPONSE");
			console.log(reponse);
			//console.log("JSON");
			var dataReponse = jQuery.parseJSON(reponse);
			//console.log(dataReponse);
			setMoistureChartdata(dataReponse);
			setHumidityChartdata(dataReponse);
			setTempChartdata(dataReponse);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			return false;
		});


	function lineMoistureChartData(){
		this.labels = [];
		this.datasets = [
			{
				label: "Moisture dataset",
				fillColor : "rgba(0,0,0,0)",
				strokeColor : "rgba(191,63,63,1)",
				pointColor : "rgba(0,0,0,0)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(0,0,0,0)",
				data : []
			}

		],
		this.setData = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				this.datasets[0].data.push(reponse[i].moisture);
			};
		},
		this.setLabels = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				//if (i%100 === 0) {
					this.labels.push(reponse[i].date);
				//} else {
					//this.labels.push("");
				//}
			}
		}
	}

	function lineHumidityChartData(){
		this.labels = [];
		this.datasets = [
			{
				label: "Humidity dataset",
				fillColor : "rgba(0,0,0,0)",
				strokeColor : "rgba(63,191,63,1)",
				pointColor : "rgba(0,0,0,0)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(0,0,0,0)",
				data : []
			}

		],
		this.setData = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				this.datasets[0].data.push(reponse[i].humidity);
			};
		},
		this.setLabels = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				//if (i%100 === 0) {
					this.labels.push(reponse[i].date);
				//} else {
				//	this.labels.push("");
				//}
			}
		}

	}

	function lineTempChartData(){
		this.labels = [];
		this.datasets = [
			{
				label: "Temperature dataset",
				fillColor : "rgba(0,0,0,0)",
				strokeColor : "rgba(63,63,191,1)",
				pointColor : "rgba(0,0,0,0)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(0,0,0,0)",
				data : []
			}

		],
		this.setData = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				this.datasets[0].data.push(reponse[i].temp);
			};
		},
		this.setLabels = function(reponse){
			l = reponse.length;
			for (var i = 0; i < l; i++) {
				//if (i%100 === 0) {
					this.labels.push(reponse[i].date);
				//} else {
				//	this.labels.push("");
				//}
			}
		}

	}


	function setMoistureChartdata(reponse){
		$('#canvasMoistureChart').empty();
		var ctx = document.getElementById("canvasMoistureChart").getContext("2d");
		var HOUR = new lineMoistureChartData();

		HOUR.setData(reponse);
		HOUR.setLabels(reponse);

		var GraphHour = new Chart(ctx).Line(HOUR, {
			pointDot: false
		});

	}

	function setHumidityChartdata(reponse){
		$('#canvasHumidityChart').empty();
		var ctx = document.getElementById("canvasHumidityChart").getContext("2d");
		var HOUR = new lineHumidityChartData();

		HOUR.setData(reponse);
		HOUR.setLabels(reponse);

		var GraphHour = new Chart(ctx).Line(HOUR, {
			pointDot: false
		});

	}
	function setTempChartdata(reponse){
		$('#canvasTempChart').empty();
		var ctx = document.getElementById("canvasTempChart").getContext("2d");
		var HOUR = new lineTempChartData();

		HOUR.setData(reponse);
		HOUR.setLabels(reponse);

		var GraphHour = new Chart(ctx).Line(HOUR, {
			pointDot: false
		});

	}

});