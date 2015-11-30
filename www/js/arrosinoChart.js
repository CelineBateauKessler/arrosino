var ARROSINO_CHART = {};

// Data
ARROSINO_CHART.rawSensor = {};

// Charts description
ARROSINO_CHART.getRawMoisture = function(index) {
  return ARROSINO_CHART.rawSensor[index].moisture;
}
ARROSINO_CHART.getRawHumidity = function(index) {
  return ARROSINO_CHART.rawSensor[index].humidity;
}
ARROSINO_CHART.getRawTemperature = function(index) {
  return ARROSINO_CHART.rawSensor[index].temp;
}
ARROSINO_CHART.chartList = [
  {name : "raw moisture", getMeasure : ARROSINO_CHART.getRawMoisture, color : "rgba(191,63,63,1)", isOn : false},
  {name : "raw humidity", getMeasure : ARROSINO_CHART.getRawHumidity, color : "rgba(63,191,63,1)", isOn : false},
  {name : "raw temperature", getMeasure : ARROSINO_CHART.getRawTemperature, color : "rgba(63,63,191,1)", isOn : false}
]
/*
"raw humidity",
"raw temperature",
"filtered moisture",
"filtered humidity",
"filtered temperature",
"precipitation forecast",
"weather forecast"]*/



ARROSINO_CHART.displayChoice = function() {
  $("#container").empty();
  $("#container").append('<div id="chartList">');
  ARROSINO_CHART.chartList.forEach(function(element, index) {
    $("#chartList").append('<div class="input-group">'+
      '<span class="input-group-addon"><input type="checkbox" name="'+index+'" /></span>'+
      '<input type="text" class="form-control" value="'+element.name+'"/>'+
      '</div>');
  });
  $("#container").append('<button type="button" id="showChart" class="btn btn-info">SHOW</button>');
}

ARROSINO_CHART.show = function() {
  // Add or clean canvas
  if ($("#canvasChart").length == 0) {
    $("#container").append('<div id="chart"><canvas id="canvasChart"></canvas></div>');
  } else {
    $('#canvasChart').empty();
  }

  ARROSINO_CHART.ctx = document.getElementById("canvasChart").getContext("2d");

  // get list of selected charts
  ARROSINO_CHART.selected = [];
  $('#chartList input:checked').each(function() {
    ARROSINO_CHART.selected.push(parseInt($(this).attr('name')));
  });

  // Initialize all datasets
  ARROSINO_CHART.chartInput = {
    labels   : [],
    datasets : []};

  var labels = ARROSINO_CHART.chartInput.labels;
  for (var i = 0; i < ARROSINO_CHART.rawSensor.length; i++) {
      labels.push(ARROSINO_CHART.rawSensor[i].date);
    };

  var nbChart = 0;
  ARROSINO_CHART.selected.forEach(function(element, index) {
    var chartDesc = ARROSINO_CHART.chartList[element];
    ARROSINO_CHART.chartInput.datasets[nbChart] = {
      label: chartDesc.name,
      fillColor : "rgba(0,0,0,0)",
      strokeColor : chartDesc.color,
      pointColor : "rgba(0,0,0,0)",
      pointStrokeColor : "#fff",
      pointHighlightFill : "#fff",
      pointHighlightStroke : "rgba(0,0,0,0)",
      data : []
    }
    var data = ARROSINO_CHART.chartInput.datasets[nbChart].data;
    for (var i = 0; i < ARROSINO_CHART.rawSensor.length; i++) {
      data.push(chartDesc.getMeasure(i));
    };
    nbChart ++;
  });
  //console.log(ARROSINO_CHART.chartInput);
  ARROSINO_CHART.chart = new Chart(ARROSINO_CHART.ctx).Line(ARROSINO_CHART.chartInput, {pointDot: false, showXLabels: 10});

  // NB : chart.addData doesn't work
  /*console.log(ARROSINO_CHART.rawSensor.length);
  //for (var i = 0; i < ARROSINO_CHART.rawSensor.length; i++) {
  for (var i = 0; i < 200; i++) {
    var elemData = [];
    var label    = ARROSINO_CHART.rawSensor[i].date;
    ARROSINO_CHART.selected.forEach(function(element, index) {
      elemData.push(ARROSINO_CHART.chartList[element].getMeasure(i));
    });
    console.log(elemData);
    ARROSINO_CHART.chart.addData(elemData, label);
  }*/

}

// Events
$("#container").on('click', "#showChart", function() {
  // get data
  $.ajax({
    url: 'php/getRawSensor.php',
    type: 'GET'
  })
  .done(function(reponse) {
    console.log(reponse);
    ARROSINO_CHART.rawSensor = jQuery.parseJSON(reponse);
    // display chart
    ARROSINO_CHART.show();
  })
  .fail(function() {
    alert("ERROR while fetching measures");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });

});
