$(document).ready(function(){

	console.log("Doc loaded");
	
		$.ajax({
			url: 'getTemp.php',
			type: 'GET'
		})
		.done(function(reponse) {
			console.log("REPONSE");
			console.log(reponse);
			console.log("JSON");
			var dataReponse = jQuery.parseJSON(reponse);
			//console.log(dataReponse);
			setChardata(dataReponse);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			return false;
		}); 
	

	function lineChartData(){
		this.labels = [];
		this.datasets = [
			{
				label: "My First dataset",
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
				if (i%100 === 0) {
					this.labels.push(reponse[i].date);
				} else {
					this.labels.push("");
				}
			}
		}

	}
		

	function setChardata(reponse){
		//$('#canvasChart').remove(); // TODO empty()
		//$('#chartZone').append('<canvas id="canvasChart"></canvas>');
		$('#canvasChart').empty();
		var ctx = document.getElementById("canvasChart").getContext("2d");
		var HOUR = new lineChartData();

		HOUR.setData(reponse);
		HOUR.setLabels(reponse);

		var GraphHour = new Chart(ctx).Line(HOUR, {
			pointDot: false
		});

	}

});