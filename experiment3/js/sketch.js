// sketch.js - purpose and description here
// Author: Marvel McDowell
// Date: 1/27/25
// Original Code adapted from https://openprocessing.org/sketch/917039  

// Globals
let flock;
let gui;
let canvasContainer;
let centerHorz, centerVert;
let lapse = 0;

const COL = createCols("https://coolors.co/cb3828-ba9836-cc7700-dbac00-bf731d");
const BOIDSNUM = 100;

let SeparationMultiplier = new SliderVariable("Separation", 4, 0, 4, 0.1);
let AlignmentMultiplier = new SliderVariable("Alignment", 0.5, 0, 2, 0.1);
let CohesionMultiplier = new SliderVariable("Cohesion", 0.5, 0, 2, 0.1);
let SeekMultiplier = new SliderVariable("TargetPosTrack", 1.5, 0, 2, 0.1);

// SliderVariable Class
class SliderVariable {
  constructor(label, value, min, max, step) {
    this.label = label;
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.slider = createSlider(min, max, value, step);
    this.slider.position(10, 10); // Adjust as needed
    this.slider.style('width', '200px'); // Adjust as needed
  }

  getValue() {
    return this.slider.value();
  }

  draw() {
    fill(0);
    noStroke();
    textSize(12);
    text(`${this.label}: ${this.getValue()}`, this.slider.x * 2 + this.slider.width, this.slider.y + 15);
  }
}

// Utility functions
function createCols(_url) {
  let slash_index = _url.lastIndexOf("/");
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = "#" + arr[i];
  }
  return arr;
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  flock.setTarget(centerHorz, centerVert);
}

// Setup function
function setup() {
  // Set up canvas container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Initialize flock and GUI
  flock = new Flock();
  for (let i = 0; i < BOIDSNUM; i++) {
    let b = new Boid(width / 2, height / 2, COL[int(random(COL.length))]);
    flock.addBoid(b);
  }
  flock.setTarget(width / 2, height / 2);

  gui = new GUI(0, 0);
  gui.addSliders([SeparationMultiplier, AlignmentMultiplier, CohesionMultiplier, SeekMultiplier]);

  // Handle window resizing
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

// Draw function
function draw() {
  background(220);

  // Update flock and GUI
  flock.run();
  gui.update();

  // Set up rotation for the rectangle
  push();
  translate(centerHorz, centerVert);
  rotate(frameCount / 100.0);
  fill(234, 31, 81);
  noStroke();
  rect(-125, -125, 250, 250);
  pop();

  // Draw text
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", centerHorz - 105, centerVert + 40);
}

// Mouse pressed function
function mousePressed() {
  if (millis() - lapse > 500) {
    save("pix.jpg");
    lapse = millis();
  }
}
