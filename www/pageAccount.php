<?php
session_start();
include('php/head.html');
?>
<!-- My account form
================================================== -->
<div class="col-lg-6">
    <label>Set location</label>
      <input type="text" class="form-control" id="location">
      <button class="btn" type="button" id="saveLocation">Save</button>
</div><!-- /.col-lg-6 -->

<div class="col-lg-6">
  <label>Change password</label>
  <input type="text" class="form-control" id="pwd1">
  <input type="text" class="form-control" id="pwd2">
  <button class="btn" type="button" id="saveNewPwd">Change</button>
</div><!-- /.col-lg-6 -->

<?php
include('php/foot.html');
?>
<script src="js/arrosinoPassword.js"></script>
