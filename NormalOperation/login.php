<?php
 
include 'connection.php';
 
$username = mysqli_real_escape_string($db, $_POST['teamname']);
$password = mysqli_real_escape_string($db, $_POST['p1name']);
$query = "SELECT Username from user WHERE Username='".$username."' and Password='".$password."'";
$val = mysqli_query($db, $query);
$result = mysqli_fetch_array($val);
if(count($result) >= 1) {
	header('Location: traffic.html');
}
else {
	echo "<script type='text/javascript'>alert('Username or Password maybe wrong!!');window.location = 'login.html'</script>";
}

?>
