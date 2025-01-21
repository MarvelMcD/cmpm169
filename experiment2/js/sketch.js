// sketch.js - purpose and description here
// Author: Marvel McDowell 
// Date:
// Code adapted from https://openprocessing.org/sketch/2223231

// Globals
let canvasContainer;
var centerHorz, centerVert;
var speed;
var balls = [];
var originalX = -1;
var originalY = -1;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Create a speed slider
  speed = createSlider(0, 2, 0.5, 0.01);
  speed.position(10, 10);  // Adjust the position of the slider on the screen

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
    this.color = color(255);  // Default color is white
    this.trail = [];  // Array to store previous positions of the ball
  }

  draw() {
    noStroke();
    
    // Draw the trail first, fading the previous positions
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 255, 0); // Decrease alpha for fading effect
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
      ellipse(this.trail[i].x, this.trail[i].y, 10);
    }
    
    // Draw the ball on top of the trail
    fill(this.color);
    circle(this.ballX, this.ballY, 10);
  }

  tick(time = 1) {
    // Save the current position in the trail array
    this.trail.push(createVector(this.ballX, this.ballY));
    if (this.trail.length > 10) { // Limit the length of the trail
      this.trail.shift(); // Remove the oldest position
    }

    // Move Ball
    this.ballX += this.speedX * time;
    this.ballY += this.speedY * time;

    // Air Drag Ball
    if (this.speedX > 0) {
      this.speedX -= this.drag * time;
    } else if (this.speedX < 0) {
      this.speedX += this.drag * time;
    }

    if (this.speedY < 0) {
      this.speedY += this.drag * time;
    }

    // Gravity Ball
    if (this.ballY < height - 1) {
      this.speedY += this.gravity * time;
    }

    // Bounce Ball (and change color when bouncing)
    if (this.ballX < 0) {
      this.ballX = 0;
      if (this.speedX < 0) {
        this.speedX = -this.speedX * this.bounciness;
        this.color = color(random(255), random(255), random(255));  // Change color on bounce
      }
    } else if (this.ballX > width) {
      this.ballX = width;
      if (this.speedX > 0) {
        this.speedX = -this.speedX * this.bounciness;
        this.color = color(random(255), random(255), random(255));  // Change color on bounce
      }
    }

    if (this.ballY > height) {
      this.ballY = height;
      if (this.speedY > 0) {
        this.speedY = -this.speedY * this.bounciness;
        this.color = color(random(255), random(255), random(255));  // Change color on bounce
      }
    } else if (this.ballY < 0) {
      this.ballY = 0;
      if (this.speedY < 0) {
        this.speedY = -this.speedY * this.bounciness;
        this.color = color(random(255), random(255), random(255));  // Change color on bounce
      }
    }
  }
}

function mousePressed() {
  originalX = mouseX;
  originalY = mouseY;
  console.log("A new ball is being created.");
}

function mouseReleased() {
  balls.push(new Ball(originalX, originalY, mouseX - originalX, mouseY - originalY, 0.05, 0.8, 1));
  originalX = -1;
  originalY = -1;
  console.log(`A new ball was created at (${mouseX}, ${mouseY})`);
}

function draw() {
  background(0);  // Clear the canvas with a black background
  
  // Draw a line while the mouse is pressed, indicating the direction and speed of the ball
  if (originalX != -1 && originalY != -1) {
    stroke(255);
    strokeWeight(1);
    line(originalX, originalY, mouseX, mouseY);
    strokeWeight(5);
    point(originalX, originalY);
    console.log(`There are ${balls.length} balls bouncing. A new ball is being created with speed (${mouseX - originalX}, ${mouseY - originalY}).`);
  } else {
    console.log(`There are ${balls.length} balls bouncing.`);
  }
  
  // Update and draw all balls
  for (var ball of balls) {
    ball.draw();
    ball.tick(speed.value());
  }
}
