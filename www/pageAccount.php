<?php
session_start();
if($_SESSION['id']){
  include('php/head.html');
  ?>
  <!-- My account form
  ================================================== -->
  <div class="col-lg-6">
      <label>Set location or use current device location</label>
        <input type="text" class="form-control" id="location" placeholder="Location name or ...">
        <input type="text" class="form-control" id="latitude" placeholder="Latitude">
        <input type="text" class="form-control" id="longitude" placeholder="Longitude">
        <button class="btn" type="button" id="setLocation">Save</button>
        <button class="btn" type="button" id="useDeviceLocation">Use current device location</button>
        <!--button class="btn" type="button" id="showLocationOnMap">Show location on map</button-->
        <div id="map"></div>
  </div>
  <br/>
  <div class="col-lg-6">
    <label>Email</label>
    <input type="text" class="form-control" id="email">
    <button class="btn" type="button" id="saveEmail">Save</button>
  </div>
  <br/>
  <div class="col-lg-6">
    <label>Change password</label>
    <input type="text" class="form-control" id="pwd1">
    <input type="text" class="form-control" id="pwd2">
    <button class="btn" type="button" id="changePwd">Change</button>
  </div>
  <br/>
  <?php
  include('php/foot.html');
  echo '<script src="http://maps.google.com/maps/api/js?sensor=false"></script>';
  echo '<script src="js/arrosinoAccount.js"></script>';
} else {
  include('pageLogin.php');
}
?>
