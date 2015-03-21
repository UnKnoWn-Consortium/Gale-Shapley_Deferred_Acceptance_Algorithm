// Objects for Gale-Shapley Deferred Acceptance Algorithm
//World object
World = function(mode, manArray, womanArray){
	this.mode = mode;
	this.steps = 0;
	this.numMan = 0;
	this.numWoman = 0;
	this.matchedPairs = [];
	this.lonelyMen = [];
	this.lonelyWomen = [];
	this.manInstances = [];
	this.womanInstances = [];
	for (var i = 0; i < manArray.length; i++){
		this.numMan ++;
		var id = this.numMan;
		id = new Man(id, manArray[i], this);
		this.manInstances.push(id);
	}
	for (var i = 0; i < womanArray.length; i++){
		this.numWoman ++;
		var id = this.numWoman;
		id = new Woman(id, womanArray[i], this);
		this.womanInstances.push(id);
	}
	for (var i = 0; i < this.manInstances.length; i++){this.manInstances[i].imposePreference();}
	for (var i = 0; i < this.womanInstances.length; i++){this.womanInstances[i].imposePreference();}
}
World.prototype.tick = function(){
	this.steps ++;
}
World.prototype.reportBuffer = function(description){
	// Report proposalBuffer of all instances
	var returnObj = {};
	returnObj.edges = [];
	returnObj.steps = String(this.steps + 1);
	if (description !== undefined){
		var upperDesc = description.toUpperCase();
	}else{upperDesc = "";}
	returnObj.output = "-----------------------------------------------------------------------\n";
	returnObj.output += "ITERATION " + String(this.steps + 1) + " " + upperDesc + "\n";
	for (var i = 0; i < this.manInstances.length; i++){
		returnObj.output += ("  " + this.manInstances[i] + " -> Buffer : ["+this.manInstances[i].proposeBuffer + "]");
		returnObj.output += (" ; Preference : ["+this.manInstances[i].prefList + "]\n");
		if (this.mode == "M"){
			returnObj.edges.push({from: String(this.manInstances[i]), to: String(this.manInstances[i].proposeBuffer)});
		}
	}
	for (var i = 0; i < this.womanInstances.length; i++){
		returnObj.output += (this.womanInstances[i] + " -> Buffer : ["+this.womanInstances[i].proposeBuffer + "]");
		returnObj.output += (" ; Preference : ["+this.womanInstances[i].prefList + "]\n");
		if (this.mode == "F"){
			returnObj.edges.push({from: String(this.womanInstances[i]), to: String(this.womanInstances[i].proposeBuffer)});
		}
	}
	return returnObj;
}
World.prototype.reportResult = function(){
	// Report the maching result
	var returnObj = {};
	this.matchedPairs = [];
	this.lonelyMen = [];
	this.lonelyWomen = [];
	returnObj.output = "#######################################################################\n";
	returnObj.output += "Gale-Shapley Deferred Acceptance Algorithm\n";
	if (this.mode == "M"){
		returnObj.output += "               Mode : Man-Proposing\n";
		for (var i = 0; i < this.manInstances.length; i++){
			var m = this.manInstances[i];
			if (m.proposeBuffer.length == 1){this.matchedPairs.push([m.toString(), m.proposeBuffer[0].toString()]);}
		}
	}else if (this.mode == "F"){
		returnObj.output += "               Mode : Woman-Proposing\n";
		for (var i = 0; i < this.womanInstances.length; i++){
			var w = this.womanInstances[i];
			if (w.proposeBuffer.length == 1){this.matchedPairs.push([w.proposeBuffer[0].toString(), w.toString()]);}
		}
	}
	returnObj.output += "    Total iteration : " + this.steps + "\n";
	returnObj.output += "Total Matched Pairs : " + this.matchedPairs.length + "\n";
	returnObj.output += "  Total Lone Wolves : " + (this.numMan+this.numWoman-2*this.matchedPairs.length) + "\n";
	returnObj.output += "         Lonely Men : " + (this.numMan-this.matchedPairs.length) + "\n";
	returnObj.output += "       Lonely Women : " + (this.numWoman-this.matchedPairs.length) + "\n";
	returnObj.output += "#######################################################################\n";
	for (var i = 0; i < this.manInstances.length; i++){
		var m = this.manInstances[i];
		if (m.proposeBuffer.length == 0){this.lonelyMen.push(m);}
	}
	for (var i = 0; i < this.womanInstances.length; i++){
		var w = this.womanInstances[i];
		if (w.proposeBuffer.length == 0){this.lonelyWomen.push(w);}
	}
	return returnObj;
}
World.prototype.checkStopCondition = function(){
	// Determine if the stop condition is fulfilled and return boolean value accordingly
	var temp = [];
	if (this.mode == "M"){
		for (var i = 0; i < this.manInstances.length; i++){
			var m = this.manInstances[i];
			if ((m.proposeBuffer.length == 0 && m.prefList.length == 0)||(m.proposeBuffer.length == 1)){temp.push(true);}else{temp.push(false)};
		}
	}else if (this.mode == "F"){
		for (var i = 0; i < this.womanInstances.length; i++){
			var w = this.womanInstances[i];
			if ((w.proposeBuffer.length == 0 && w.prefList.length == 0)||(w.proposeBuffer.length == 1)){temp.push(true);}else{temp.push(false)};
		}
	}
	if (temp.indexOf(false) == -1){return true;}else{return false;}
}
World.prototype.main = function(){
	if (this.mode == "M"){
		for (var i = 0; i < this.manInstances.length; i++){this.manInstances[i].propose();}
		if(self.document === undefined){ // Determine whether the object is created inside a Web Worker
			postMessage(this.reportBuffer("Proposal"));
			console.log(this.reportBuffer("Proposal").output);
		}else{console.log(this.reportBuffer("Proposal").output);}
		for (var i = 0; i < this.womanInstances.length; i++){this.womanInstances[i].evaluate();}
		if(self.document === undefined){ // Determine whether the object is created inside a Web Worker
			postMessage(this.reportBuffer("Final"));
			console.log(this.reportBuffer("Final").output);
		}else{console.log(this.reportBuffer("Final").output);}
		this.tick();
	}else if (this.mode == "F"){
		for (var i = 0; i < this.womanInstances.length; i++){this.womanInstances[i].propose();}
		if(self.document === undefined){ // Determine whether the object is created inside a Web Worker
			postMessage(this.reportBuffer("Proposal"));
			console.log(this.reportBuffer("Proposal").output);
		}else{console.log(this.reportBuffer("Proposal").output);}
		for (var i = 0; i < this.manInstances.length; i++){this.manInstances[i].evaluate();}
		if(self.document === undefined){ // Determine whether the object is created inside a Web Worker
			postMessage(this.reportBuffer("Final"));
			console.log(this.reportBuffer("Final").output);
		}else{console.log(this.reportBuffer("Final").output);}
		this.tick();
	}
}
World.prototype.run = function(){
	// Wrap the main into a while loop
	var temp = this.checkStopCondition();
	while (temp != true){
		this.main();
		temp = this.checkStopCondition();
	}
	if(self.document === undefined){ // Determine whether the object is created inside a Web Worker
		postMessage(this.reportResult());
		console.log(this.reportResult().output);
	}else{console.log(this.reportResult().output);}
}


//Agent object
Agent = function(id, pref, world){
	this.id = id;
	this.world = world;
	this.proposeBuffer = [];
	this.Preference = pref.split(',');
	this.prefList = [];
	
}
Agent.prototype.propose = function(){ 
	// Propose to the Man/Woman instance at prefList[0], i.e. the most preferred Man/Woman
	// Propose target is kept in proposeBuffer array of proposer and receiver
	if (this.proposeBuffer.length == 0 && this.prefList.length > 0){
		this.proposeBuffer.push(this.prefList[0]);
		this.prefList[0].proposeBuffer.push(this);
	}
}
Agent.prototype.evaluate = function(){
	// Evaluate received proposals
	var tempArray = this.proposeBuffer;
	for (var i = 0; i < this.proposeBuffer.length; i++){
		// Reject any unacceptable man
		var p = this.proposeBuffer[i];
		if (this.prefList.indexOf(p) === -1){
			tempArray.splice(tempArray.indexOf(p), 1);
			p.proposeBuffer.splice(p.proposeBuffer.indexOf(this), 1);
			p.prefList.splice(p.proposeBuffer.indexOf(this), 1);
		}
	}
	/* Sort received proposals in descending order with the preference order, 
       reject all proposals except the one from the most preferable*/
	this.proposeBuffer = tempArray;
	var tempList = this.prefList;
	this.proposeBuffer.sort(function(a, b){
		return (tempList.indexOf(a) - tempList.indexOf(b));}
	);
	for (var i = 1; i < this.proposeBuffer.length; i++){
		var p = this.proposeBuffer[i];
		p.proposeBuffer.splice(p.proposeBuffer.indexOf(this), 1);
		p.prefList.splice(p.prefList.indexOf(this), 1);
	}
	this.proposeBuffer.splice(1, this.proposeBuffer.length);
}

// Man object
function Man(id, pref, world){ // Man object inherits from the Agent object
	Agent.call(this, id, pref, world);
}
Man.prototype = Object.create(Agent.prototype);
Man.prototype.constructor = Man;
Man.prototype.imposePreference = function(){ 
	// Supersede the preference list with a list of Woman instances in descending order
	if (!(this.Preference.length == 1 && this.Preference[0] == "")){
		for (var i = 0; i < this.Preference.length; i++){this.prefList.push(this.world.womanInstances[Number(this.Preference[i])-1]);}
	}
}
Man.prototype.toString = function(){
	return "Man " + this.id;
}

// Woman object
function Woman(id, pref, world){ // Woman obhect inherits from the Agent object
	Agent.call(this, id, pref, world);
}
Woman.prototype = Object.create(Agent.prototype);
Woman.prototype.constructor = Woman;
Woman.prototype.imposePreference = function(){
	// Supersede the preference list with a list of Man instances in descending order
	if (!(this.Preference.length == 1 && this.Preference[0] == "")){
		for (var i = 0; i < this.Preference.length; i++){this.prefList.push(this.world.manInstances[Number(this.Preference[i])-1]);}
	}
}
Woman.prototype.toString = function(){
	return "Woman " + this.id;
}
