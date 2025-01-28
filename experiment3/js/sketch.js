// sketch.js - purpose and description here
// Author: Marvel McDowell
// Date: 1/27/25
// Original Code adapted from https://openprocessing.org/sketch/917039  

// GUI and SliderVariable
class SliderVariable {
  constructor(label, value, min, max, step) {
    this.label = label;
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }

  display() {
    this.value = constrain(this.value, this.min, this.max);
    textSize(14);
    fill(255);
    text(`${this.label}: ${this.value.toFixed(2)}`, 10, this.y);
    this.y += 20;
  }
}

class GUI {
  constructor(x, y) {
    this.sliders = [];
    this.x = x;
    this.y = y;
  }

  addSliders(sliders) {
    this.sliders = sliders;
  }

  update() {
    for (let slider of this.sliders) {
      slider.display();
    }
  }
}

// Boid class
class Boid {
  constructor(x, y, col) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector(0, 0);
    this.r = 3.0;
    this.maxspeed = 3;
    this.maxforce = 0.05;
    this.color = col;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  flock(boids) {
    let sep = this.separate(boids).mult(SeparationMultiplier.value);
    let ali = this.align(boids).mult(AlignmentMultiplier.value);
    let coh = this.cohesion(boids).mult(CohesionMultiplier.value);
    let seek = this.seek(flock.target).mult(SeekMultiplier.value);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(seek);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  render() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  separate(boids) {
    let desiredSeparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.setMag(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  align(boids) {
    let neighborDist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(boids) {
    let neighborDist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return createVector(0, 0);
  }
}

// Flock class
class Flock {
  constructor() {
    this.boids = [];
    this.target = createVector(width / 2, height / 2);
  }

  addBoid(b) {
    this.boids.push(b);
  }

  setTarget(x, y) {
    this.target.set(x, y);
  }

  run() {
    for (let b of this.boids) {
      b.run(this.boids);
    }
  }
}

// Main script
const COL = createCols("https://coolors.co/cb3828-ba9836-cc7700-dbac00-bf731d");
const BOIDSNUM = 100;
let lapse = 0;
let flock;
let bg;
let gui;
let SeparationMultiplier = new SliderVariable("Separation", 4, 0, 4, 0.1);
let AlignmentMultiplier = new SliderVariable("Alignment", 0.5, 0, 2, 0.1);
let CohesionMultiplier = new SliderVariable("Cohesion", 0.5, 0, 2, 0.1);
let SeekMultiplier = new SliderVariable("TargetPosTrack", 1.5, 0, 2, 0.1);

function setup() {
  createCanvas(1112, 834);
  background(0);
  bg = createGraphics(width, height);
  bg.background(0, 10);
  bg.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x * 0.01, y * 0.01) * 2;
    bg.fill(0, 10);
    bg.rect(x, y, s, s);
  }

  flock = new Flock();
  for (let i = 0; i < BOIDSNUM; i++) {
    let b = new Boid(width / 2, height / 2, COL[int(random(COL.length))]);
    flock.addBoid(b);
  }
  flock.setTarget(width / 2, height / 2);
  gui = new GUI(0, 0);
  gui.addSliders([SeparationMultiplier, AlignmentMultiplier, CohesionMultiplier, SeekMultiplier]);
}

function draw() {
  if (frameCount % 120 == 0) {
    const x = random(width);
    const y = random(height);
    flock.setTarget(x, y);
  }
  image(bg, 0, 0);

  flock.run();

  gui.update();
}

function mousePressed() {
  if (millis() - lapse > 500) {
    save("pix.jpg");
    lapse = millis();
  }
}

function createCols(_url) {
  let slash_index = _url.lastIndexOf("/");
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = "#" + arr[i];
  }
  return arr;
}
