<?php
session_start();
if($_SESSION['id']){
  include('php/head.html');
  echo '<div id="container" class="container"></div>';
  include('php/foot.html');
} else {
  include('pageLogin.php');
}
?>
