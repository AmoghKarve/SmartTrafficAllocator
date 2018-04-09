<?php

$message = '';
$username = 'someuser';
$password = 'hello123';
$db = new mysqli('localhost', $username, $password, 'trafficDatabase');

if ($db->connect_error){
	$message = $db->connect_error;
}
else{
	echo $message;
}
?>
