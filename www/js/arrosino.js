$(document).ready(function(){

	var JsonRawSensor;
	var JsonFilteredSensor;
	var JsonSettings;

	/* Default display = Activity Display */
	$.ajax({
		url: 'php/arrosinoActivity.php',
		type: 'GET'
	})
	.done(function(reponse) {
		$("#container").html(reponse);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		return false;
	});

	$("#settings").click(function(){
		$.ajax({
			url: 'php/getSettings.php',
			type: 'GET'
		})
		.done(function(reponse) {
			JsonSettings = jQuery.parseJSON(reponse);
			$("#container").html(ARROSINO_SETTINGS.display(JsonSettings));
		})
		.fail(function() {
			console.log("ERROR");
		})
		.always(function() {
			console.log("DONE");
			return false;
		});
	});

	$("[name='rawMeasures']").click(function(){
		$.ajax({
			url: 'php/getRawSensor.php',
			type: 'GET'
		})
		.done(function(reponse) {
			console.log("REPONSE");
			console.log(reponse);
			//console.log("JSON");
			//var dataReponse = jQuery.parseJSON(reponse);
			//console.log(dataReponse);
			/*setMoistureChartdata(dataReponse);
			setHumidityChartdata(dataReponse);
			setTempChartdata(dataReponse);*/
		})
		.fail(function() {
			console.log("ERROR");
		})
		.always(function() {
			console.log("DONE");
			return false;
		});
	});
	//$("body").on("click", ".chart", function() {
	$("[name='filteredMeasures']").click(function(){
		$.ajax({
			url: 'php/getHourAvgSensor.php',
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
	});

});
