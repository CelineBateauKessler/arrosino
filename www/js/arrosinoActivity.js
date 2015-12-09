var ARROSINO_ACTIVITY = {};

ARROSINO_ACTIVITY.activity = {};

ARROSINO_ACTIVITY.display = function(){
  console.log(ARROSINO_ACTIVITY.activity);
  $("#container").empty();

  // Buttons to force manual ON/OFF
  $("#container").append('<div id="OnOffButtons" class="btn-toolbar" role="toolbar">');

  $("#OnOffButtons").append('<button id="waterOn" class="btn" type="button">MANUAL ON</button>');
  $("#OnOffButtons").append('<button id="waterOff" class="btn" type="button">MANUAL OFF</button>');

  $.each(ARROSINO_ACTIVITY.activity, function(index, element) {
    $('#container').append('<h2>'+element.date.slice(0,16)+'<h2>');
    $('#container').append('<p><span class="glyphicon glyphicon-time"></span>  '+element.duration+' minutes<p>');
    $('#container').append('<p><span class="glyphicon glyphicon-tint"></span>  '+element.volume+' litres<p>');
    $('#container').append('<hr>');
    });

}

$("body").on('click', "#waterOn", function() {
  $.ajax({
    url: '../../data/put/WATER_ON/1', // use Yun REST API
    type: 'POST'
  })
  .done(function(reponse) {
    console.log(reponse);
  })
  .fail(function() {
    console.log("ERROR");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });
});

$("body").on('click', '#waterOff', function() {
  $.ajax({
    url: '../../data/put/WATER_ON/0', // use Yun REST API
    type: 'POST'
  })
  .done(function(reponse) {
    console.log(reponse);
  })
  .fail(function() {
    console.log("ERROR");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });
});

$(document).ready(function() {
  $.ajax({
    url: 'php/getActivity.php',
    type: 'GET'
  })
  .done(function(reponse) {
    ARROSINO_ACTIVITY.activity = jQuery.parseJSON(reponse);
    $("#container").html(ARROSINO_ACTIVITY.display());
  })
  .fail(function() {
    console.log("ERROR");
  })
  .always(function() {
    console.log("DONE");
    return false;
  });
});
