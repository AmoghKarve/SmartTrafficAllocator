function checkDensitie(){
	return;
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
	var signalName = document.getElementById("junction").value;
	iter = iteration;
	$.ajax({
		type : 'post',
		url : 'traffic.php',
	    datatype : 'json',
		data : "signalName=" + signalName + "&iteration=" + iteration,
		success : function(response) {
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
var w;
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
