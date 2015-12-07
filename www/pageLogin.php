<?php
session_start();
include('php/head.html');
?>
<!-- Login form
================================================== -->
<div class="col-lg-6">
    <label>Please, enter password</label>
    <div class="input-group">
      <input type="text" class="form-control" id="password" autofocus="">
      <span class="input-group-btn">
        <button class="btn" type="button" id="enterPassword">Go!</button>
      </span>
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->

<?php
include('php/foot.html');
?>
<script src="js/arrosinoPassword.js"></script>
