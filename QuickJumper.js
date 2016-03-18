var controlObject = new ControlObject(0,0,20,0,0,5);
var blackHoleObject = new BlackHoleObject(200, 200, 20, 0, 0, 3);
var missiles = new Array();

var startTime = 0;

var frequencyOfFrameUpdate = 15;
var frequencyOfGameUpdate = 15;
var frequencyOfMissleLaunch = 1000;

function init() {

	document.addEventListener('keydown', function(event) {
		handleKeyPress(event.keyCode);
	});

	document.addEventListener('keyup', function(event) {
		handleKeyRelease(event.keyCode);
	});

	startTime = (new Date()).getTime();

	setInterval(updateGame, frequencyOfGameUpdate);
	setInterval(launchMissile, frequencyOfMissleLaunch);
	setInterval(updateFrame, frequencyOfFrameUpdate);

}

var left = 37, up = 38, right = 39, down = 40;

var leftPressed = false, upPressed = false, rightPressed = false, downPressed = false;

function handleKeyPress(code) {
	switch(code) {
		case left: 
			leftPressed = true;
			break;
		case up: 
			upPressed = true;
			break;
		case right: 
			rightPressed = true;
			break;
		case down: 
			downPressed = true;
			break;
	}
}

function handleKeyRelease(code) {
	switch(code) {
		case left: 
			leftPressed = false;
			break;
		case up: 
			upPressed = false;
			break;
		case right: 
			rightPressed = false;
			break;
		case down: 
			downPressed = false;
			break;
	}
}

function updateGame() {
	blackHoleObject.updatePosition();
	for(var mis in missiles) {
		missiles[mis].updatePosition();
	}
	controlObject.updatePosition();
}

function launchMissile() {
	missiles.push(new MissileObject(80, 80, 20, 0, 0, 6));
	console.log("launched " + missiles[0].toString());
}

function updateFrame() {
	var game = document.getElementById("game");
	var gameCtx = game.getContext("2d");
	
	gameCtx.fillStyle="red";
	gameCtx.fillRect(-1, -1, 10000, 10000);
	console.log(gameCtx.width);
	gameCtx.beginPath();
    gameCtx.arc(controlObject.obj.x, controlObject.obj.y, 10, 0, 2 * Math.PI, false);
    gameCtx.fillStyle = 'green';
    gameCtx.fill();
    gameCtx.lineWidth = 5;
    gameCtx.strokeStyle = 'green';
    gameCtx.stroke();

    gameCtx.beginPath();
    gameCtx.arc(blackHoleObject.obj.x, blackHoleObject.obj.y, 10, 0, 2 * Math.PI, false);
    gameCtx.fillStyle = 'black';
    gameCtx.fill();
    gameCtx.lineWidth = 5;
    gameCtx.strokeStyle = 'black';
    gameCtx.stroke();

    for(var mis in missiles) {
    	gameCtx.beginPath();
    	gameCtx.arc(missiles[mis].obj.x, missiles[mis].obj.y, 5, 0, 2 * Math.PI, false);
    	gameCtx.fillStyle = 'yellow';
    	gameCtx.fill();
    	gameCtx.lineWidth = 5;
    	gameCtx.strokeStyle = 'yellow';
    	gameCtx.stroke();
    }
}



function Object(x, y, diam, color, mass, speed) {
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.diam = diam;
	this.color = color;
	this.mass = mass;
	this.speed = speed;     //pixels per second

	this.move = function() {
		var unadjustedVel = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		var speedScaleFactor = (unadjustedVel == 0)? 0 : this.speed / unadjustedVel;
		//console.log(speedScaleFactor);
		this.x += this.dx * speedScaleFactor;
		this.y += this.dy * speedScaleFactor;
		//console.log("pos : (" + this.x + "," + this.y + ")");
	}

	this.setXDirection = function(dx) {
		this.dx = dx;
	}

	this.setYDirection = function(dy) {
		this.dy = dy;
	}

}

function ControlObject(x, y, diam, color, mass, speed) {
	this.obj = new Object(x, y, diam, color, mass, speed);

	this.updatePosition = function() {
		this.updateDirection();
		this.obj.move();
	}

	this.updateDirection = function() {
		if(leftPressed && !rightPressed) {
			this.obj.setXDirection(-1);
		} else if(rightPressed && !leftPressed) {
			this.obj.setXDirection(1);
		} else if(!leftPressed && !rightPressed) {
			this.obj.setXDirection(0);
		}

		if(upPressed && !downPressed) {
			this.obj.setYDirection(-1);
		} else if(downPressed && !upPressed) {
			this.obj.setYDirection(1);
		} else if(!upPressed && !downPressed) {
			this.obj.setYDirection(0);
		}

	}
}

function BlackHoleObject(x, y, diam, color, mass, speed) {
	this.obj = new Object(x, y, diam, color, mass, speed);

	this.updatePosition = function() {
		this.updateDirection();
		this.obj.move();
	}

	this.updateDirection = function() {
		this.obj.setXDirection(controlObject.obj.x - this.obj.x);
		this.obj.setYDirection(controlObject.obj.y - this.obj.y);
	}

}

function MissileObject(x, y, diam, color, mass, speed) {
	this.obj = new Object(x, y, diam, color, mass, speed);

	this.updatePosition = function() {
		this.updateDirection();
		this.obj.move();
	}

	this.updateDirection = function() {
		this.obj.setXDirection(blackHoleObject.obj.x - this.obj.x);
		this.obj.setYDirection(blackHoleObject.obj.y - this.obj.y);
	}

	this.toString = function() {
		return "(" + this.obj.x + " , " + this.obj.y + ") ::: {" + this.obj.dx + " , " + this.obj.dy + "}";
	}
}