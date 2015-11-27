var ARROSINO_SETTINGS = {};

ARROSINO_SETTINGS.settings = {};

ARROSINO_SETTINGS.display = function(json){
  ARROSINO_SETTINGS.settings = json;
  console.log(ARROSINO_SETTINGS.settings);
  $("#container").empty();
  $("#container").append('<ul class="list-group">');
  $.each(json, function(index, element) {
    $('#container').append('<li name="'+index+'" class="list-group-item setting">' + element.name +
     '<span class="badge">' + element.value + '</span></li>');
    });
  $("#container").append('</ul>');
}

$('body').on('click', '.setting', function() {
  console.log("***change setting***");
  console.log(ARROSINO_SETTINGS.settings);
  // If there is already an input area for another setting :
  // remove it and revert to badge with previous value
  var input = $('#container').find($('#newSetting'));
  if (input.length > 0) {
    console.log("modif in progress for " + input.attr('name'))
    input.parent().append('<span class="badge">' + ARROSINO_SETTINGS.settings[parseInt(input.attr('name'))].value + '</span></li>');
    input.remove();
  }
  // Remove the badge and replace by an input area
  var badge = $(this).find($('span'));
  if (badge) {
    badge.remove();
    $(this).append('<div id="newSetting" class="input-group" name="'+ $(this).attr('name')+'">'+
                    '<input type="text" class="form-control" placeholder="Enter new value">'+
                    '<span class="input-group-btn">'+
                    '<button id="saveSetting" class="btn" type="button">Save</button>'+
                    '</span></div>');
  }
});

$('body').on('click', '#saveSetting', function() {
  var input = $('#container').find($('#newSetting'));
  if (input.length > 0) {
    // Check value
    var intValue = input.val();
    if (isNaN(intValue))
    {
      input.val("A number is expected");
    }
    else
    {
      // Update local data
      ARROSINO_SETTINGS.settings[parseInt(input.attr('name'))].value = intValue;
      input.parent().append('<span class="badge">' + intValue + '</span></li>');
      input.remove();
      // Update remote database
      $.ajax({
        url: 'postSettings.php',
        type: 'POST',
        data: ARROSINO_SETTINGS.settings
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
  }
});
