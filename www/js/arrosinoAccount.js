
function processLocation() {
  if (navigator.geolocation) {
    function successGeo(position) {
      $("#latitude").val(position.coords.latitude);
      $("#longitude").val(position.coords.longitude);
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var optionsGmap = {
        mapTypeControl:false,
        center: latlng,
        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom:15
      };
      $("#map").show();
      var map = new google.maps.Map(document.getElementById("map"), optionsGmap)
      var marker = new google.maps.Marker({
        position: latlng,
        map:map,
        title:"watering location"
      });
    }
    navigator.geolocation.getCurrentPosition(successGeo);
  }
}

$("#useDeviceLocation").click(function(){
  console.log("processLocation")
  processLocation();
})

// Events
$(document).ready(function() {
  $("#map").hide();
})
