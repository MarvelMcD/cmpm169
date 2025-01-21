// sketch.js - purpose and description here
// Author: Marvel McDowell 
// Date:
//Code adapted from https://openprocessing.org/sketch/2223231

// Globals
let canvasContainer;
var centerHorz, centerVert;
var speed;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  speed = createSlider(0,2,0.5,0.01);
	speed.position(0,0);


  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

class Ball {
	constructor(ballX = 0, ballY = 0, speedX = 0, speedY = 0, drag = 0, bounciness = 1, gravity = 1) {
		this.ballX = ballX;
		this.ballY = ballY;
		this.speedX = speedX;
		this.speedY = speedY;
		this.drag = drag;
		this.bounciness = bounciness;
		this.gravity = gravity;
	}
	draw() {
		noStroke();
		fill("white");
		circle(this.ballX,this.ballY,10);
	}
	tick(time = 1) {
		//Move Ball
		this.ballX += this.speedX * time;
		this.ballY += this.speedY * time;
		//Air Drag Ball
		if (this.speedX > 0) {
			this.speedX -= this.drag * time;
		}
		else if (this.speedX < 0) {
			this.speedX += this.drag * time;
		}
		if (this.speedY < 0) {
			this.speedY += this.drag * time;
		}
		//Gravity Ball
		if (this.ballY < height-1) {
			this.speedY += this.gravity * time;
		}
		//Bounce Ball
		if (this.ballX < 0) {
			this.ballX = 0;
			if (this.speedX < 0) {
				this.speedX = -this.speedX*this.bounciness;
			}
		}
		else if (this.ballX > width) {
			this.ballX = width;
			if (this.speedX > 0) {
				this.speedX = -this.speedX*this.bounciness;
			}
		}
		if (this.ballY > height) {
			this.ballY = height;
			if (this.speedY > 0) {
				this.speedY = -this.speedY*this.bounciness;
			}
		}
		else if (this.ballY < 0) {
			this.ballY = 0;
			if (this.speedY < 0) {
				this.speedY = -this.speedY*this.bounciness;
			}
		}
	}
}

var balls = [];

var originalX = -1;
var originalY = -1;

function mousePressed() {
	originalX = mouseX;
	originalY = mouseY;
	describe("A new ball is being created.");
}

function mouseReleased() {
	balls.push(new Ball(originalX,originalY,mouseX-originalX,mouseY-originalY,0.05,0.8,1));
	originalX = -1;
	originalY = -1;
	describe("A new ball was created at (${mouseX},${mouseY})");
}

function draw() {
	background("black");
	if (originalX != -1 && originalY != -1) {
		stroke("white");
		strokeWeight(1);
		line(originalX,originalY,mouseX,mouseY);
		strokeWeight(5);
		point(originalX,originalY);
		describe("There are ${balls.length} balls bouncing in a box. A new ball is being created with a speed of (${mouseX-originalX},${mouseY-originalY}).");
	}
	else {
		describe("There are ${balls.length} balls bouncing in a box.");
	}
	for (var ball in balls) {
		balls[ball].draw();
		balls[ball].tick(speed.value());
	}
}

