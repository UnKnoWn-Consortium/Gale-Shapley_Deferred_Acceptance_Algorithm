// Web Worker JS
var g; // Define a global variable for assignment
onmessage = function(e) {
	var date = new Date();
	var command = e.data.status;
	postMessage(date.toISOString() + " WORKER : Command " + command.toUpperCase() + " received from main script");
	console.log(date.toISOString() + " WORKER : Command " + command.toUpperCase() + " received from main script");
	importScripts("objects.js");
	if (command == "setup"){
		var manArray = e.data.ListM;
		var womanArray = e.data.ListF;
		var Mode = e.data.Mode;
		g = new World(Mode, manArray, womanArray);
		console.log('Posting message back to main script');
		postMessage({output: date.toISOString() + " WORKER : Preference arrays received"});
		postMessage({output: date.toISOString() + " WORKER : Instances created"});
		postMessage({output: date.toISOString() + " WORKER : Ready..."});
	}else if (command == "runOnce"){
		if(typeof(g) === "undefined"){
			postMessage({output: date.toISOString() + " WORKER : WORLD NOT FOUND"});
			postMessage({output: date.toISOString() + " WORKER : Please press SETUP first"});
		}else{
			postMessage({output: date.toISOString() + " WORKER : ITERATION " + (g.steps+1) + " OUTPUT..."});
			g.main();
		}
	}else if (command == "summary"){
		if(typeof(g) === "undefined"){
			postMessage({output: date.toISOString() + " WORKER : WORLD NOT FOUND"});
			postMessage({output: date.toISOString() + " WORKER : Please press SETUP first"});
		}else{
			var temp = g.reportResult();
			postMessage({output: date.toISOString() + " WORKER : SUMMARY...\n" + temp.output});
			console.log(temp.output);
		}
	}else if (command == "run"){
		if(typeof(g) === "undefined"){
			postMessage({output: date.toISOString() + " WORKER : WORLD NOT FOUND"});
			postMessage({output: date.toISOString() + " WORKER : Please press SETUP first"});
		}else{
			postMessage({output: date.toISOString() + " WORKER : AUTO-RUN OUTPUT..."});
			g.run();
		}
	}
}