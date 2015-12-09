var ARROSINO_CHART = {};

// Data
ARROSINO_CHART.rawSensor = {};
ARROSINO_CHART.filteredSensor = {};
ARROSINO_CHART.weatherForecast = {};

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
ARROSINO_CHART.getRawFlow = function(index) {
  return ARROSINO_CHART.rawSensor[index].flow;
}
ARROSINO_CHART.getFilteredMoisture = function(index) {
  return ARROSINO_CHART.filteredSensor[index].moisture;
}
ARROSINO_CHART.getFilteredHumidity = function(index) {
  return ARROSINO_CHART.filteredSensor[index].humidity;
}
ARROSINO_CHART.getFilteredTemperature = function(index) {
  return ARROSINO_CHART.filteredSensor[index].temp;
}
ARROSINO_CHART.getQpf = function(index) {
  return ARROSINO_CHART.weatherForecast[index].qpf;
}
ARROSINO_CHART.getQpf = function(index) {
  if (ARROSINO_CHART.filteredSensor[index].date.substring(11,15) == '12:0') {
    ARROSINO_CHART.wfIndex +=1;
    console.log(ARROSINO_CHART.wfIndex);
    return ARROSINO_CHART.weatherForecast[ARROSINO_CHART.wfIndex].qpf;
  }
  else {
    return 0.0;
  }

}
/*ARROSINO_CHART.getWeatherIcon = function(index) {
  return ARROSINO_CHART.weatherForecast[index].icon_url;
}*/

ARROSINO_CHART.chartList = [
  {name : "raw moisture", getMeasure : ARROSINO_CHART.getRawMoisture, color : "#388E3C"},
  {name : "raw humidity", getMeasure : ARROSINO_CHART.getRawHumidity, color : "#FFA000"},
  {name : "raw temperature", getMeasure : ARROSINO_CHART.getRawTemperature, color : "#D32F2F"},
  {name : "raw flow", getMeasure : ARROSINO_CHART.getRawFlow, color : "#3F51B5"},
  {name : "filtered moisture", getMeasure : ARROSINO_CHART.getFilteredMoisture, color : "#009688"},
  {name : "filtered humidity", getMeasure : ARROSINO_CHART.getFilteredHumidity, color : "#FFC107"},
  {name : "filtered temperature", getMeasure : ARROSINO_CHART.getFilteredTemperature, color : "#FF4081"},
  //{name : "filtered flow", getMeasure : ARROSINO_CHART.getFilteredFlow, color : "rgba(200,60,40,1)"},
  {name : "precipitation forecast", getMeasure : ARROSINO_CHART.getQpf, color : "#00BCD4"}
  //{name : "weather", getMeasure : ARROSINO_CHART.getWeatherIcon, color : "#FFFFFF"}
]

ARROSINO_CHART.displayChoice = function() {
  $("#container").empty();
  $("#container").append('<button type="button" id="selectChart" class="btn btn-info" display="none">SELECT</button>');
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
  // Hide list of charts
  $("#chartList").hide();
  $("#selectChart").show();
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
  for (var i = 0; i < ARROSINO_CHART.filteredSensor.length; i++) {
    // NB: filteredSensor and rawSensor are expected to have the same time base
    var date = ARROSINO_CHART.filteredSensor[i].date;
    if (date.substring(11,15)=='00:0' || date.substring(11,15)=='12:0'){
      // Display time on abscisse only for noon and midnight
      labels.push(ARROSINO_CHART.rawSensor[i].date);
    } else {
      labels.push('');
    }
  }

  var nbChart = 0;
  ARROSINO_CHART.wfIndex=0;
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
    // NB: filteredSensor and rawSensor are expected to have the same time base
    for (var i = 0; i < ARROSINO_CHART.filteredSensor.length; i++) {
      console.log(chartDesc.name + ' '+i);
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
$(document).ready(function() {
  ARROSINO_CHART.displayChoice();
  $.ajax({
    url: 'php/getRawSensor.php',
    type: 'GET'
  })
  .done(function(reponse) {
    ARROSINO_CHART.rawSensor = jQuery.parseJSON(reponse);
  })
  .fail(function() {
    alert("ERROR while fetching raw measures");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });
  $.ajax({
    url: 'php/getFilteredSensor.php',
    type: 'GET'
  })
  .done(function(reponse) {
    ARROSINO_CHART.filteredSensor = jQuery.parseJSON(reponse);
  })
  .fail(function() {
    alert("ERROR while fetching filtered measures");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });

  $.ajax({
    url: 'php/getWeatherForecast.php',
    type: 'GET'
  })
  .done(function(reponse) {
    ARROSINO_CHART.weatherForecast = jQuery.parseJSON(reponse);
  })
  .fail(function() {
    alert("ERROR while fetching weather forecast");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });
});

$("body").on('click', "#showChart", function() {
  ARROSINO_CHART.show();
});

$("body").on('click', "#selectChart", function() {
  $("#chartList").show();
  $("#selectChart").hide();
});
