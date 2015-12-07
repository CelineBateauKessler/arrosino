var ARROSINO_SETTINGS = {};

ARROSINO_SETTINGS.settings = {};

ARROSINO_SETTINGS.display = function(json){
  ARROSINO_SETTINGS.settings = json;
  console.log(ARROSINO_SETTINGS.settings);
  $("#container").empty();
  // Table with all settings
  $("#container").append('<table id="settingsTable" class="table">');
  $("#settingsTable").append('<thead><tr><th class="hideMobile">Name</th>'+
                    '<th class="hideMobile">Value</th>'+
                    '<th class="hideMobile">Min</th>'+
                    '<th class="hideMobile">Max</th>'+
                    '</tr></thead>');
  $("#settingsTable").append('<tbody id="settingsBody">');

  $.each(json, function(index, element) {
    $('#settingsBody').append('<tr name="'+element.name+'"><td>'+element.description+'</td>'+
                    '<td><input type="text" class="form-control" value='+element.value+'></td>'+
                    '<td>'+element.min+'</td>'+
                    '<td>'+element.max+'</td>'+
                    '</tr>');
    });
  // Save or restore
  $("#container").append('<div id="buttons" class="btn-toolbar" role="toolbar">');

  $("#buttons").append('<button id="saveSetting" class="btn" type="button">Save</button>');

  $("#buttons").append('<button id="restoreSetting" class="btn dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">Restore '+
  '<span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>');
  $("#buttons").append('<ul id="preSetsList" class="dropdown-menu">');
  $("#preSetsList").append('<li><a href="#">Default</a></li>');
  $("#preSetsList").append('<li><a href="#">Aromatics</a></li>');
  $("#preSetsList").append('<li><a href="#">Mediterranean garden</a></li>');
  $("#preSetsList").append('<li><a href="#">Golf</a></li>');
  $("#preSetsList").append('<li><a href="#">Cactus</a></li>');

  $("#buttons").append('<button id="cancel" class="btn" type="button">Cancel</button>');
}

$('body').on('click', '#saveSetting', function() {
  console.log(ARROSINO_SETTINGS.settings);
  // Check all inputs
  var isOK = true;
  $('#settingsBody').find('tr').each(function(index, element) {
    $(this).removeClass("alert alert-danger");
    newValue = $(this).find('input').val();
    if (isNaN(newValue)) {
      $(this).find('input').val("Numeric value is expected");
      $(this).addClass("alert alert-danger");
      isOK = false;
    }
    else {
      // tr index = json index
      if ((newValue > ARROSINO_SETTINGS.settings[index].max) || (newValue < ARROSINO_SETTINGS.settings[index].min)) {
        $(this).find('input').val("Value outside bounds");
        $(this).addClass("alert alert-danger");
        isOK = false;
      }
    }

  });

  if (isOK) {
    // Update local data
    $('#settingsBody').find('tr').each(function(index, element) {
      ARROSINO_SETTINGS.settings[index].value = $(this).find('input').val();
    });
    console.log(ARROSINO_SETTINGS.settings);
    // Update remote database
    $.ajax({
      url: 'php/postSettings.php',
      type: 'POST',
      data: {settings : ARROSINO_SETTINGS.settings}
      })
      .done(function(reponse) {
        console.log("SAVED");  })
      .fail(function() {
        console.log("ERROR");
      })
      .always(function() {
        console.log("DONE");
        return false;
      });
    }
});

$(document).ready(function() {
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
