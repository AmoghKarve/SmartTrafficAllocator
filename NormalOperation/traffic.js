function checkDensitie(){
	return;
}
var directionsDisplay;
var directionsService;
let polyline;
let allSignals = [{"latitude":18.564836,"longitude":73.774525,"visited":0},{"latitude":18.560457,"longitude":73.788094,"visited":0},{"latitude":18.553145,"longitude":73.802850,"visited":0},{"latitude":18.551908,"longitude":73.804136,"visited":0},{"latitude":18.542259,"longitude":73.828350,"visited":0},{"latitude":18.534962,"longitude":73.839127,"visited":0}];
var ambulance = [{"latitude":18.573045,"longitude":73.762804},{"latitude":18.565511,"longitude":73.772673},{"latitude":18.564478,"longitude":73.775690},{"latitude":18.561315,"longitude":73.787374},{"latitude":18.554209,"longitude":73.801818},{"latitude":18.543068,"longitude":73.825650},{"latitude":18.530966,"longitude":73.846672}];
var ambulanceLatitude = 18.5603;
var ambulanceLongitude = 73.8092;
var thresholdTime = 200;
var ambulanceIndex = 0;
var gMarkers = [];
let map;
let i;
let ambulanceLength = Object.keys(ambulance).length;


function initMap() {
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	polyline = new google.maps.Polyline({
		path: []
	});
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: {lat: 41.85, lng: -87.65}
	});
	directionsDisplay.setMap(map);

	var onChangeHandler = function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay,'kalpataru estate,pimple gurav','sancheti');
		updateSignals();
	};
}
function startDemo(){
	calculateAndDisplayRoute(directionsService, directionsDisplay,'balewadi stadium','sancheti');
	document.getElementById('demoButton').style.visibility = "hidden";
}

var overrideOrNot = 0; //if 0 normal operation
function addMarker(location, map,override,timeToReach) {
	let length = Object.keys(allSignals).length;
	if(override == 1){
		for(j = 0; j < length;j++ ){
			if(allSignals[j]['latitude'] === location['latitude'] && allSignals[j]['longitude'] === location['longitude']){
				allSignals[j]['visited'] = 1;
				console.log(j);
				break;
			}
		}
	}
	source = new google.maps.LatLng(location['latitude'],location['longitude']);
	if(override === 2){
		var marker = new google.maps.Marker({
			position: source,
			label:{
				text: "A"
			} ,
			icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
			map: map
		});
		gMarkers.push(marker);
		return;
	}

	if(override === 1){
		var marker = new google.maps.Marker({
			position: source,
			label:{
				text: "O"
			} ,
			map: map
		});
	}else {
		var marker = new google.maps.Marker({
			position: source,
			label:{
				text: "N"
			},
			map: map
		});
	}
	google.maps.event.addDomListener(marker, 'click', function() {
		overrideOrNot = override;
		localStorage.setItem("overrideOrNot", overrideOrNot);
		localStorage.setItem("estimatedTime", timeToReach);	
		window.location = "traffic.html";
	});
	gMarkers.push(marker);

}

function calculateAndDisplayRoute(directionsService, directionsDisplay,start,end) {
	directionsService.route({
		origin: start,
		destination: end,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {

			var bounds = new google.maps.LatLngBounds();
			var legs = response.routes[0].legs;
			for (i = 0; i < legs.length; i++) {
				var steps = legs[i].steps;
				for (j = 0; j < steps.length; j++) {
					var nextSegment = steps[j].path;
					for (k = 0; k < nextSegment.length; k++) {
						polyline.getPath().push(nextSegment[k]);
						bounds.extend(nextSegment[k]);
					}
				}
			}
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}
var hospital;
function getRoute(){
	var source = 'shirine garden';
	var destination = 'sancheti';
	calculateAndDisplayRoute(directionsService,directionsDisplay,source,destination);
}

function updateSignals(){
	let length = Object.keys(allSignals).length;
	var markers = gMarkers;
	console.log(markers);
	for(x = 0; x < markers.length; x++){
		markers[x].setMap(null);
	}
	if(ambulanceIndex == ambulanceLength){
		alert("Demo done. Ambulance reached!");
		document.getElementById('demoButton').style.visibility = "visible";
		return;
	}
	addMarker(ambulance[ambulanceIndex],map,2,0);
	//gMarkers = [];
	let origin = new google.maps.LatLng( ambulance[ambulanceIndex]['latitude'], ambulance[ambulanceIndex]['longitude'] );
	ambulanceIndex = ambulanceIndex + 1;
	for(i = 0;i < length;i++){
		let estimatedTime = 1000;
		let myPosition = new google.maps.LatLng(allSignals[i]['latitude'],allSignals[i]['longitude']);
		//console.log(google.maps.geometry.poly.isLocationOnEdge(myPosition, polyline,100));
		if(1 === 1 && allSignals[i]['visited'] == 0) {
			let myDestination = new google.maps.LatLng(allSignals[i]['latitude'],allSignals[i]['longitude']);
			let destination = allSignals[i];
			let directionsService = new google.maps.DirectionsService();
			let request = {
				origin: origin,
				destination: myDestination,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
			//let estimatedTime;
			let routeIt = function () {
				return new Promise (function(resolve, reject) {
					directionsService.route( request, function( response, status ) {
						if ( status === 'OK' ) {
							let point = response.routes[ 0 ].legs[ 0 ];
							estimatedTime = (point.duration.value);
							result = {
								point, estimatedTime, i
							}
							resolve(result);
						}
						else if (status === "OVER_QUERY_LIMIT") {
							console.log("oql");
							setTimeout(function(){i = i - 1;},2000);
						}
						else {
							reject(status)
						}
					});
				});
			}
			routeIt().then(
					function (result) {
						if(estimatedTime < thresholdTime){
							addMarker(destination,map,1,estimatedTime);
						}else {
							addMarker(destination,map,0,estimatedTime);
						}
					}
					).catch(function (reject) {
				console.log(reject);
			});

		}
		else {
			let destination = allSignals[i];
			addMarker(destination,map,0);
		}
	}
}

var timeForSignal = [];
var timePerSignal = [];
var timeSignal = [];
var timeSorted = [];
var timeReady = [];
var timeLeft = [];
var signal = [];
var tot = 0;
var visited = [];
var iter, totalIterations;

function logout() {
	window.location = "login.html";
}
var timeOverrideSignal = [];
function overrideSignal(estimatedTime) {
	var signalSet = Math.floor(Math.random() * 4);
	if(signalSet == 0)
		signalSet = 4;
	timeOverrideSignal[0] = parseInt(estimatedTime) + 10;
	setSignal(signalSet);
	keepgoing = true;
	startOverride();	
}
var overrideCheck = 0;
function loadPage(iteration) {
	timeForSignal = [];
	timePerSignal = [];
	timeSignal = [];
	timeSorted = [];
	timeReady = [];
	timeLeft = [];
	signal = [];
	tot = 0;
	visited = [];
	overrideCheck = localStorage.getItem("overrideOrNot");
	if(overrideCheck == 1) {
		var estimatedTime = localStorage.getItem("estimatedTime");
		overrideSignal(estimatedTime);
		return;
	}

	//var signalName = document.getElementById("junction").value;
	var signalName = "abcd";
	iter = iteration;
	$.ajax({
		type : 'post',
		url : 'traffic.php',
		datatype : 'json',
		data : "signalName=" + signalName + "&iteration=" + iteration,
		success : function(response) {
			localStorage.clear();
			keepgoing = false;
			for(var i = 0; i < response.length; i++) {
				var id = (i + 1) + "";
				var video = document.getElementById(id);
				video.src = response[i].videoFeed;
			}
			totalIterations = response[0].totalIterations;
			if(response.length == 3) {
				document.getElementById("signal_4").style.display = "none";
				document.getElementById("signal_3").style.width = "31%";
				document.getElementById("signal_2").style.width = "31%";
				document.getElementById("signal_1").style.width = "31%";
				document.getElementById("signal3").style.width = "25%";
				document.getElementById("signal2").style.width = "25%";
				document.getElementById("signal1").style.width = "25%";
			}
			else {
				document.getElementById("signal_4").style.display = "block";
				document.getElementById("signal_3").style.width = "23%";
				document.getElementById("signal_2").style.width = "23%";
				document.getElementById("signal_1").style.width = "23%";
				document.getElementById("signal3").style.width = "36%";
				document.getElementById("signal2").style.width = "36%";
				document.getElementById("signal1").style.width = "36%";
			}
			//document.getElementById("signal_1_circle1").style.fill = "transparent";
			/*if(response.length == 3) {
			  checkDensitie(response[0].videoFeed, response[1].videoFeed, response[2].videoFeed);
			  }
			  else {
			  checkDensitie(response[0].videoFeed, response[1].videoFeed, response[2].videoFeed, response[3].videoFeed);
			  }*/
			//Finding Maximum density
			for(var i = 0; i < response.length; i++) {
				var timeValue = Math.round(response[i].density * 60 + 5);
				if(timeValue < 10)
					timeValue = 10;
				tot += timeValue;
				timeSorted.push(timeValue);
				timePerSignal.push(timeValue);
				timeForSignal.push(timeValue);
				timeSignal.push(timeValue);
				signal.push(i + 1);
			}
			for(var i = 0; i < timeForSignal.length; i++) {
				for(var j = 0; j < timeForSignal.length; j++){
					if(timeForSignal[i] > timeForSignal[j]) {
						var temp = timeForSignal[i];
						timeForSignal[i] = timeForSignal[j];
						timeForSignal[j] = temp;
						temp = signal[i];
						signal[i] = signal[j];
						signal[j] = temp;
						temp = timeSignal[i];
						timeSignal[i] = timeSignal[j];
						timeSignal[j] = temp;
					}
				}
			}
			for(var i = timeForSignal.length - 1; i > 0; i--) {
				var value = timeSignal[i];
				for(var j = i - 1; j >= 0; j--) {
					value += timeSignal[j];
				}
				timeSignal[i] = value;
			}
			for(var i = 0; i < signal.length; i++) {
				timeSorted[signal[i] - 1] = timeSignal[i];
			}
			for(var i = 0; i < timeSorted.length; i++) {
				timeLeft.push(tot - timeSorted[i]);
				visited.push(0);
			}
			for(var i = timeForSignal.length - 1; i > 0; i--) {
				var value = 0;
				for(var j = i - 1; j >= 0; j--) {
					value += timeForSignal[j];
				}
				timeForSignal[i] = value;
			}
			for(var i = 0; i < signal.length; i++) {
				timeSorted[signal[i] - 1] = timeForSignal[i];
			}
			for(var i = 0; i < timeSorted.length; i++) {
				timeReady.push(timeSorted[i]);
			}
			setSignal(signal[0]);
			startTimer();
		}
	});
}
var w;
var keepgoing = true, readystate = false;
function startTimer() {
	keepgoing = true;
	var start = new Date();
	localStorage.setItem("start", start);
	var start = 1;
	var myTime = new Date(localStorage.getItem("start"));
	var dt = new Date();
	var ts = [];

	var $worked = $("#timer_1");
	if(readystate)
		ts[1] = timeReady[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	else
		ts[1] = timeSorted[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	$worked.html(ts[1]);

	$worked = $("#timer_2");
	if(readystate)
		ts[1] = timeReady[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	else {
		ts[1] = timeSorted[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	}
	$worked.html(ts[1]);

	$worked = $("#timer_3");
	if(readystate)
		ts[1] = timeReady[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	else {
		ts[1] = timeSorted[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	}
	$worked.html(ts[1]);

	if(timeForSignal.length > 3) {
		$worked = $("#timer_4");
		if(readystate)
			ts[1] = timeReady[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		else {
			ts[1] = timeSorted[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		}		$worked.html(ts[1]);
	}

	if(keepgoing)
		setTimeout(updateTimer, 1000);
}
var nowTime;
function startOverride() {
	localStorage.clear();
	var start = new Date();
	localStorage.setItem("startSignal", start);
	var start = 1;
	var myTime = new Date(localStorage.getItem("startSignal"));
	var dt = new Date();
	var ts = [];
	var $worked = $("#timer_1");
	ts[1] = timeOverrideSignal[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	$worked.html(ts[1]);
	$("#timer_2").html(ts[1]);
	$("#timer_3").html(ts[1]);
	$("#timer_4").html(ts[1]);
	if(keepgoing)
		setTimeout(update, 1000);
}
function update() {
	while(1) {
		var myTime = new Date(localStorage.getItem("startSignal"));
		var dt = new Date();
		var ts = [];
		var $worked = $("#timer_1");
		ts[1] = timeOverrideSignal[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		$worked.html(ts[1]);
		$("#timer_2").html(ts[1]);
		$("#timer_3").html(ts[1]);
		$("#timer_4").html(ts[1]);
		break;		
	}
	if(keepgoing)
		w = setTimeout(update, 1000);
	else
		localStorage.clear();

}
function updateTimer() {
	while(1){
		var flag = 0;
		var myTime = new Date(localStorage.getItem("start"));
		var dt = new Date();
		var ts = [];
		var $worked = $("#timer_1");
		if(readystate)
			ts[1] = timeReady[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		else {
			ts[1] = timeSorted[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		}
		$worked.html(ts[1]);
		if(currentSignal == 1) {
			if(ts[1] == 0) {
				keepgoing = false;
				var next = 1;
				visited[0] = 1;
			}
			else if(ts[1] == 3) {
				readystate = true;
				keepgoing = false;
				visited[0] = 1;
				flag = 1;
			}
		}
		$worked = $("#timer_2");
		if(readystate)
			ts[1] = timeReady[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		else {
			ts[1] = timeSorted[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		}
		$worked.html(ts[1]);
		if(currentSignal == 2) {
			if(ts[1] == 0) {
				keepgoing = false;
				var next = 2;
				visited[1] = 1;
			}
			else if(ts[1] == 3) {
				readystate = true;
				keepgoing = false;
				visited[1] = 1;
				flag = 1;
			}
		}
		$worked = $("#timer_3");
		if(readystate)
			ts[1] = timeReady[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		else {
			ts[1] = timeSorted[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		}
		$worked.html(ts[1]);
		if(currentSignal == 3) {
			if(ts[1] == 0) {
				keepgoing = false;
				var next = 3;
				visited[2] = 1;
			}
			else if(ts[1] == 3) {
				readystate = true;
				keepgoing = false;
				visited[2] = 1;
				flag = 1;
			}
		}
		if(timeForSignal.length > 3) {
			$worked = $("#timer_4");
			if(readystate)
				ts[1] = timeReady[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
			else {
				ts[1] = timeSorted[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
			}
			$worked.html(ts[1]);
			if(currentSignal == 4) {
				if(ts[1] == 0) {
					keepgoing = false;
					var next = 4;
					visited[3] = 1;
				}
				else if(ts[1] == 3) {
					readystate = true;
					keepgoing = false;
					visited[3] = 1;
					flag = 1;
				}
			}
		}
		break;
	}
	if(keepgoing) {
		w = setTimeout(updateTimer, 1000);
	}
	else {
		if(flag == 0)
			getNextSignal(next);
		else {
			flag = 0;
			setReadySignal();
		}
	}
}
var currentSignal;
function getNextSignal(i) {
	readystate = 0;
	for(var j = 0; j < timeSorted.length; j++) {
		if(j != i - 1) {
			timeSorted[j] = timeSorted[j] - timeSorted[i - 1];
		}
	}
	timeSorted[i - 1] = timeLeft[i - 1];

	var next;
	for(var j = 0; j < signal.length; j++) {
		if(signal[j] == i && j != signal.length - 1) {
			next = signal[j + 1];
			break;
		}
	}
	if(visitedAllOrNot() == 1) {
		for(var j = 1; j <= signal.length; j++) {
			var id1 = "signal_" + j + "_circle1";
			var id2 = "signal_" + j + "_circle2";
			document.getElementById(id1).style.fill = "red";
			document.getElementById(id2).style.fill = "transparent";
		}
		alert("This iteration is over!!");
		if(iter < totalIterations) {
			loadPage(iter + 1);
		}
		else {
			alert("Iterations over!!");
		}
	}
	else {
		timeSorted[next - 1] = timePerSignal[next - 1];
		setSignal(next);
		startTimer();
	}
}
function visitedAllOrNot() {
	for(var i = 0; i < visited.length; i++) {
		if(visited[i] == 0)
			return 0;
	}
	return 1;
}
function setSignal(i) {
	currentSignal = i;
	var len = signal.length;
	if(overrideCheck == 1)
		len = 4;
	for(var j = 1; j <= len; j++) {
		var id1 = "signal_" + j + "_circle1";
		var id2 = "signal_" + j + "_circle2";
		var id3 = "signal_" + j + "_circle3";
		if(j == i) {
			document.getElementById(id1).style.fill = "transparent";
			document.getElementById(id2).style.fill = "transparent";
			document.getElementById(id3).style.fill = "green";
		}
		else {
			document.getElementById(id1).style.fill = "red";
			document.getElementById(id2).style.fill = "transparent";
			document.getElementById(id3).style.fill = "transparent";
		}
	}
}
function setReadySignal() {
	document.getElementById("signal_" + currentSignal + "_circle1").style.fill = "transparent";
	document.getElementById("signal_" + currentSignal + "_circle2").style.fill = "yellow";
	document.getElementById("signal_" + currentSignal + "_circle3").style.fill = "transparent";
	timeReady[currentSignal - 1] = 3;
	var next;
	for(var j = 0; j < signal.length; j++) {
		if(signal[j] == currentSignal && j != signal.length - 1) {
			next = signal[j + 1];
			break;
		}
	}
	if(visitedAllOrNot() != 1) {
		timeReady[next - 1] = 3;
		document.getElementById("signal_" + next + "_circle1").style.fill = "transparent";
		document.getElementById("signal_" + next + "_circle2").style.fill = "yellow";
		document.getElementById("signal_" + next + "_circle3").style.fill = "transparent";
		for(var i = 0; i < signal.length; i++) {
			if(i == currentSignal - 1)
				continue;
			else if(i == next - 1)
				continue;
			else {
				timeReady[i] = timeSorted[i] - timeSorted[currentSignal - 1] + 3;
			}
		}
		startTimer();
	}
	else {
		for(var j = 1; j <= signal.length; j++) {
			var id1 = "signal_" + j + "_circle1";
			var id2 = "signal_" + j + "_circle2";
			var id3 = "signal_" + j + "_circle3";
			document.getElementById(id1).style.fill = "transparent";
			document.getElementById(id2).style.fill = "yellow";
			document.getElementById(id3).style.fill = "transparent";
			timeReady[j - 1] = 3;
		}
		startTimer();
	}

}
function checkDensities(){
	var source1 = arguments[0];
	var source2 = arguments[1];
	var source3 = arguments[2];
	var source4;
	if(arguments.length != 4)
		source4 = "";
	else
		source4 = arguments[3];
	var details = {'source1' : source1, 'source2' : source2, 'source3' : source3, 'source4' : source4};
	$.ajax({
		type : 'post',
		url : '1.php',
		datatype : 'json',
		data : "source1=" + source1 + "&source2=" + source2 + "&source3=" + source3 + "&source4=" + source4,
		//data : {message:JSON.stringify(details)},
		success : function(response) {
			console.log(response);
		}
	});
}
