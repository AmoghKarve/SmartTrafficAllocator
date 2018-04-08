function checkDensitie(){
	return;
}
var timeForSignal = [];
var timePerSignal = [];
var timeSignal = [];
var timeSorted = [];
var timeLeft = [];
var signal = [];
var tot = 0;
var visited = [];
function loadPage() {
	var signalName = document.getElementById("junction").value;
	var iteration = 1;
	$.ajax({
		type : 'post',
		url : 'traffic.php',
	    datatype : 'json',
		data : "signalName=" + signalName + "&iteration=" + iteration,
		success : function(response) {
			console.log(response);

			for(var i = 0; i < response.length; i++) {
				var id = (i + 1) + "";
				var video = document.getElementById(id);
				video.src = response[i].videoFeed;
			}
			//document.getElementById("signal_1_circle1").style.fill = "transparent";
			/*if(response.length == 3) {
				checkDensitie(response[0].videoFeed, response[1].videoFeed, response[2].videoFeed);
			}
			else {
				checkDensitie(response[0].videoFeed, response[1].videoFeed, response[2].videoFeed, response[3].videoFeed);
			}*/
			//Finding Maximum density
			var max = response[0].density, maxpos = 0;
			for(var i = 1; i < response.length; i++) {
				if(response[i].density > max){
					max = response[i].density;
					maxpos = i;
				}
			}

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
			console.log(timeSorted);
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
			//timeForSignal.sort(function(a, b){return b - a});
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
			setSignal(maxpos + 1);
			console.log(timeSorted);
			console.log(timeForSignal);
			console.log(timeLeft);
			console.log(signal);
			startTimer();
		}
	});
}
var keepgoing = true;
function startTimer() {
	keepgoing = true;
	var start = new Date();
	localStorage.setItem("start", start);
	var start = 1;
	var myTime = new Date(localStorage.getItem("start"));
	var dt = new Date();
	var ts = [];

	var $worked = $("#timer_1");
	ts[1] = timeSorted[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	$worked.html(ts[1]);

	$worked = $("#timer_2");
	ts[1] = timeSorted[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	$worked.html(ts[1]);

	$worked = $("#timer_3");
	ts[1] = timeSorted[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
	$worked.html(ts[1]);

	if(timeForSignal.length > 3) {
		$worked = $("#timer_4");
		ts[1] = timeSorted[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		$worked.html(ts[1]);
	}

	if(keepgoing)
		setTimeout(updateTimer, 1000);
}
var w;
function updateTimer() {
	while(1){
		var myTime = new Date(localStorage.getItem("start"));
		var dt = new Date();
		var ts = [];
		var $worked = $("#timer_1");
		ts[1] = timeSorted[0] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		$worked.html(ts[1]);
		if(ts[1] == 0 && currentSignal == 1) {
			keepgoing = false;
			var next = 1;
			visited[0] = 1;
		}/*
		else if(ts[1] == 3) {
			keepgoing = false;
			var num = 1;
		}*/
		$worked = $("#timer_2");
		ts[1] = timeSorted[1] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		$worked.html(ts[1]);
		if(ts[1] == 0 && currentSignal == 2) {
			keepgoing = false;
			var next = 2;
			visited[1] = 1;
		}
		$worked = $("#timer_3");
		ts[1] = timeSorted[2] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
		$worked.html(ts[1]);
		if(ts[1] == 0 && currentSignal == 3) {
			keepgoing = false;
			var next = 3;
			visited[2] = 1;
		}
		if(timeForSignal.length > 3) {
			$worked = $("#timer_4");
			ts[1] = timeSorted[3] - (dt.getHours()*3600 - myTime.getHours()* 3600 + dt.getMinutes()*60 - myTime.getMinutes()*60 + dt.getSeconds() - myTime.getSeconds());
			$worked.html(ts[1]);
			if(ts[1] == 0 && currentSignal == 4) {
				keepgoing = false;
				var next = 4;
				visited[3] = 1;
			}
		}
		break;
	}
	if(keepgoing) {
		w = setTimeout(updateTimer, 1000);
	}
	else {
		getNextSignal(next);
	}
}
var currentSignal;
function getNextSignal(i) {
	for(var j = 0; j < timeSorted.length; j++) {
		if(j != i - 1) {
			timeSorted[j] = timeSorted[j] - timeSorted[i - 1];
		}
	}
	timeSorted[i - 1] = timeLeft[i - 1];
	console.log("hi");

	var next;
	for(var j = 0; j < signal.length; j++) {
		if(signal[j] == i && j != signal.length - 1) {
			next = signal[j + 1];
			break;
		}
	}
	if(visitedAllOrNot() == 1)
		alert("This iteration is over!!");
	else {
		timeSorted[next - 1] = timePerSignal[next - 1];
		console.log(timeSorted);
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
	for(var j = 1; j <= signal.length; j++) {
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
