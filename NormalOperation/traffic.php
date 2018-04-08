<?php

include 'connection.php';

$trafficSignalName = $_POST['signalName'];
$iteration = $_POST['iteration'];

$query = "SELECT t.trafficSignalId, v.videoFeed, v.density, j.totalIterations FROM video v, trafficSignal t, junction j where t.videoFeedId = v.videoFeedId and t.iteration = v.iteration and t.iteration = $iteration and j.junctionName = '".$trafficSignalName."' and t.junctionId = j.junctionId;";
$val = mysqli_query($db, $query);

if(!$val) {
	die('Could not get data');
}
$all_rows = array();
while($row = mysqli_fetch_array($val, MYSQLI_ASSOC)) {
	$all_rows[] = $row;
}

header("Content-type:application/json");
echo json_encode($all_rows);
mysqli_close($db);
?>
