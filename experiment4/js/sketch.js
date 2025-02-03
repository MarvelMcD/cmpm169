// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Code adapted from https://openprocessing.org/sketch/1763456

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

const QFACTOR = 1;
const SCALE_FACTOR = 1;
const COLOR = true;
const BOTH_IMAGES = false;

let img;

function preload() {
	//img = loadImage(FILE_NAME);
	capture = createCapture(VIDEO);
  capture.size(640, 480);
	img = createImage(640, 480);
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

function setup() {
	//if (BOTH_IMAGES)
		//createCanvas(img.width * SCALE_FACTOR * 2, img.height * SCALE_FACTOR);
	//else
		//createCanvas(img.width * SCALE_FACTOR, img.height * SCALE_FACTOR);
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(img.width * SCALE_FACTOR, img.height * SCALE_FACTOR);
    canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
	
	capture.hide();
}

function draw() {
	background(255);
	img.loadPixels();
	capture.loadPixels();
	for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				let i = y * img.width + x;
				img.pixels[4 * i] = capture.pixels[4 * i];
				img.pixels[4 * i + 1] = capture.pixels[4 * i + 1];
				img.pixels[4 * i + 2] = capture.pixels[4 * i + 2];
				img.pixels[4 * i + 3] = 255;
			}
	}
	img.updatePixels();
	//print(img.pixels[0]);
	updateImagePixels();
	image(img, 0, 0);
}

function updateImagePixels() {
	if (BOTH_IMAGES)
		image(img, 0, 0, img.width * SCALE_FACTOR, img.height * SCALE_FACTOR);
	img.loadPixels();
	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			let oldR = img.pixels[redIndex(x, y)];
			let oldG = img.pixels[greenIndex(x, y)];
			let oldB = img.pixels[blueIndex(x, y)];
			let newR = quantization(oldR);
			let newG = quantization(oldG);
			let newB = quantization(oldB);
			if (COLOR)
				setPixel(x, y, newR, newG, newB);
			else
				setPixelGray(x, y, newR, newG, newB);
			
			let errR = oldR - newR;
			let errG = oldG - newG;
			let errB = oldB - newB;
			addError(x + 1, y    , errR, errG, errB, 7 / 16);
			addError(x - 1, y + 1, errR, errG, errB, 3 / 16);
			addError(x    , y + 1, errR, errG, errB, 4 / 16);
			addError(x + 1, y + 1, errR, errG, errB, 1 / 16);
		}
	}
	img.updatePixels();
	/*if (BOTH_IMAGES)
		image(img, img.width * SCALE_FACTOR, 0, img.width * SCALE_FACTOR, img.height * SCALE_FACTOR);
	else
	  image(img, 0, 0, img.width * SCALE_FACTOR, img.height * SCALE_FACTOR);*/
}

function quantization(old) {
	return 255 / QFACTOR * round(QFACTOR * old / 255);
}

function redIndex(x, y) {
	return 4 * (img.width * y + x);
}

function greenIndex(x, y) {
	return 4 * (img.width * y + x) + 1;
}

function blueIndex(x, y) {
	return 4 * (img.width * y + x) + 2;
}

function setPixel(x, y, r, g, b) {
	img.pixels[redIndex(x, y)] = r;
	img.pixels[greenIndex(x, y)] = g;
	img.pixels[blueIndex(x, y)] = b;
}

function setPixelGray(x, y, r, g, b) {
	let gray = quantization((r + g + b) / 3);
	setPixel(x, y, gray, gray, gray);
}

function addError(x, y, r, g, b, scale) {
	img.pixels[redIndex(x, y)] += scale * r;
	img.pixels[greenIndex(x, y)] += scale * g;
	img.pixels[blueIndex(x, y)] += scale * b;
}

function getPixel(x, y) {
	return img.pixels[redIndex(x, y)];
}
