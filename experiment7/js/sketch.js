let angle = 0;
let w = 24;
let ma;
let maxD;
let mic;
let pulse;
let rotX = 0;
let rotY = 0;

function setup() {
  createCanvas(1100, 800, WEBGL);

  ma = atan(1 / sqrt(2));
  maxD = dist(0, 0, 200, 200);
  mic = new p5.AudioIn([errorCallback]);
  mic.start();
  
  rotX = QUARTER_PI;
  rotY = -ma;
}

function draw() {
  let micLevel = mic.getLevel();

  // Gradient background color based on mic level
  let bgColor = color(255, map(micLevel, 0, 1, 0, 255), 255);
  background(bgColor);
  

  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;

  ortho(-250, 250, 250, -250, 0, 500);
  rotateX(rotX);
  rotateY(rotY);

  for (let z = 0; z < height; z += w) {
    for (let x = 0; x < width; x += w) {
      push();
      let d = dist(x, z, width / 2, height / 2);
      let offset = map(d, 0, maxD, -2, 2);
      let a = angle + offset;
      let h;

      if (micLevel > 5E-4) {
        h = map(sin(a), -1, 1, 0, (150 + 3 * map(micLevel, 0.0, 1.0, 0.0, height)));
      } else {
        h = map(sin(a), -1, 1, 0, 150);
      }

      // Pulse effect based on mic level
      pulse = map(sin(a), -1, 1, 0, 1.5);
      scale(pulse);  // Apply pulsing effect to shapes

      // Decide the shape based on the sound level
      let shapeType = micLevel > 0.1 ? (frameCount % 3 === 0 ? 'sphere' : 'box') : 'cone';
      translate(x - width / 2, 0, z - height / 2);

      // Apply color based on mic level
      let colorFactor = map(micLevel, 0, 1, 100, 255);
      let shapeColor = color(colorFactor, 255 - colorFactor, map(sin(a), -1, 1, 100, 255));

      // Use fill() for simple color application
      fill(shapeColor); 

      // Render dynamic shapes based on shapeType
      if (shapeType === 'sphere') {
        sphere(w / 2);  // Sphere with radius based on width
      } else if (shapeType === 'box') {
        box(w - 2, h, w - 2);  // Box with dynamic height
      } else if (shapeType === 'cone') {
        cone(w / 2, h);  // Cone with base radius and height based on mic input
      }

      pop();
    }
  }

  angle += 0.1;
}

function mouseDragged() {
  let rate = 0.01;
  rotX += (pmouseY - mouseY) * rate;
  rotY += (mouseX - pmouseX) * rate;
}

function keyPressed() {
  if (key == 'o') {
    rotX = QUARTER_PI;
    rotY = -ma;
  }
}

function errorCallback() {
  print("\n---Check your microphone access. (Safari and iOS devices do not currently allow microphone access.)---\n");
}
