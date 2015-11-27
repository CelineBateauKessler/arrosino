<?php
// TODO ajouter min/max pour chaque param
// get settings from database and turn to JSON
echo '[';
echo '{"name" : "moisture low threshold", "value" : "200"},';
echo '{"name" : "moisture high threshold", "value" : "500"},';
echo '{"name" : "dry soil optimal duration", "value" : "2"},';
echo '{"name" : "dry soil max duration", "value" : "5"}';
echo ']';
?>
