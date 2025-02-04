// sketch.js - Camera Dithering
// Author: Marvel McDowell
// Date: 2.3.2025
// Code adapted from https://openprocessing.org/sketch/2225629
const bayerMatrix = {  
	2: [[ -0.5 ,  0    ],
		[  0.25, -0.25 ]],
	
	4: [[ -0.5   ,  0     , -0.375 ,  0.125  ],
		[  0.25  , -0.25  ,  0.375 , -0.125  ],
		[ -0.3125,  0.1875, -0.4375,  0.0625 ],
		[  0.4375, -0.0625,  0.3125, -0.1875 ]],
  
	8: [[-0.5, 0.0, -0.375, 0.125, -0.46875, 0.03125, -0.34375, 0.15625],
		[0.25, -0.25, 0.375, -0.125, 0.28125, -0.21875, 0.40625, -0.09375],
		[-0.3125, 0.1875, -0.4375, 0.0625, -0.28125, 0.21875, -0.40625, 0.09375],
		[0.4375, -0.0625, 0.3125, -0.1875, 0.46875, -0.03125, 0.34375, -0.15625],
		[-0.453125, 0.046875, -0.328125, 0.171875, -0.484375, 0.015625, -0.359375, 0.140625],
		[0.296875, -0.203125, 0.421875, -0.078125, 0.265625, -0.234375, 0.390625, -0.109375],
		[-0.265625, 0.234375, -0.390625, 0.109375, -0.296875, 0.203125, -0.421875, 0.078125],
		[0.484375, -0.015625, 0.359375, -0.140625, 0.453125, -0.046875, 0.328125, -0.171875]],
};

const w = 640;
const h = 480;
let cap, mic, amplitude;
let bayerNSelector, colorModeSelector;
let bayerR = 50;
let bayerThreshold = 100;

let micButton;

function setup() {
    createCanvas(w, h).parent('#canvas-container'); // Attach the canvas to the container
    noStroke();
    textAlign(RIGHT);

    // Create a button to start the microphone
    micButton = createButton('Start Microphone');
    micButton.position(10, 10);
    micButton.mousePressed(startMic); // Attach event handler

    // Setup video capture
    cap = createCapture(VIDEO, { flipped: true });
    cap.size(w, h);
    cap.hide();

    // Set up selectors
    bayerNSelector = createSelect();
    bayerNSelector.position(6, 60);
    bayerNSelector.option(2);
    bayerNSelector.option(4);
    bayerNSelector.option(8);
    bayerNSelector.selected(4);

    colorModeSelector = createSelect();
    colorModeSelector.position(56, 60);
    colorModeSelector.option('CIELAB');
    colorModeSelector.option('HSI');
    colorModeSelector.option('HSL');
    colorModeSelector.option('HSV');
    colorModeSelector.option("Y'CbCr");
    colorModeSelector.selected('CIELAB');

    describe('Play with Bayer dithering options over live webcam, reacting to sound');
}

function startMic() {
    // Ensure the audio context is resumed and the mic is started
    getAudioContext().resume().then(() => {
        mic = new p5.AudioIn();
        mic.start(); // Start the mic input
        micButton.hide(); // Hide the button once microphone starts
    });
}





function lum(r, g, b) {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function lin(v) {
	if (v <= 0.04045 * 255) return v / 12.92;
	else return pow(((v / 255 + 0.055) / 1.055), 2.4) * 255;
}

function Lstar(r, g, b) {
	let Y = lum(lin(r), lin(g), lin(b));
	if (Y <= (216 / 24389) * 255) return Y * (24.389 / 27);
	else return (pow(Y / 255, 1 / 3) * 1.16 - 0.16) * 255;
}

function draw() {
	// Get sound level and use it to modify parameters
	let soundLevel = mic.getLevel(); // 0.0 - 1.0
	bayerR = lerp(bayerR, map(soundLevel, 0, 1, 50, 400), 0.1);
	bayerThreshold = lerp(bayerThreshold, map(soundLevel, 0, 1, 100, 200), 0.1);

	cap.loadPixels();
	const bayerN = bayerNSelector.selected();
	const colorMode = colorModeSelector.selected();
	let i, r, g, b, mono, bayerValue;

	for (let x = 0; x < w; x++)
		for (let y = 0; y < h; y++) {
			i = (x + y * w) * 4;
			r = cap.pixels[i];
			g = cap.pixels[i + 1];
			b = cap.pixels[i + 2];

			let originalMono = (r + g + b) / 3;
			if (colorMode == 'CIELAB') mono = Lstar(r, g, b);
			else if (colorMode == "Y'CbCr") mono = lum(r, g, b);
			else if (colorMode == 'HSV') mono = max(r, g, b);
			else if (colorMode == 'HSL') mono = (max(r, g, b) + min(r, g, b)) / 2;
			else mono = originalMono; // 'HSI'

			bayerValue = bayerMatrix[bayerN][y % bayerN][x % bayerN];
			if (mono + bayerR * bayerValue >= bayerThreshold) {
				r = 237;
				g = 230;
				b = 205;
			} else {
				r = 33;
				g = 38;
				b = 63;
			}
			cap.pixels[i] = r;
			cap.pixels[i + 1] = g;
			cap.pixels[i + 2] = b;
		}

	cap.updatePixels();
	image(cap, 0, 0);

	// Draw UI
	fill(255);
	rect(w - 25, 22 - 15, 21, 15);
	rect(w - 25, 49 - 15, 21, 15);
	fill(0);
	text(int(bayerR), w - 5, 19);
	text(int(bayerThreshold), w - 5, 46);
}
