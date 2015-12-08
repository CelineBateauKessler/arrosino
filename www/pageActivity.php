<?php
session_start();
if($_SESSION['id']){
  include('php/head.html');
  echo '<div id="container" class="container"></div>';
  include('php/foot.html');
  echo '<script src="js/arrosinoActivity.js"></script>';
} else {
  include('pageLogin.php');
}
?>
