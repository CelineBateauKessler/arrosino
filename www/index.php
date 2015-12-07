<?php
session_start(); 
if($_SESSION['id']){
  include('pageActivity.php');
} else {
  include('pageLogin.php');
}
