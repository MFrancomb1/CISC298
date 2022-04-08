
let colorPalette = [[154, 6, 128, 255], [121, 1, 140, 255], [76, 0, 112, 255], [22, 0, 64, 255]];
let withinSight;
let startingPoint;
let rocket;
let planet;
let p= 0;
let planetDiam = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  startingPoint = createVector(width/2, height/2+planetDiam/2+50);
  planet = new Planet(planetDiam, startingPoint, colorPalette);
  rocket = new Rocket(createVector(startingPoint.x, height/2));
}

function draw() {
  background(8, 0, 35);
  planet.display();
  rocket.display();
  planet.update(rocket.speed);
  console.log(planet.dist);
}

class Rocket {
  constructor(position) {
    this.p = position;
    this.speed = 2;
  }

  move() {
    // handles all horizontal rocket movements
  }

  display() {
    fill(200);
    ellipse(this.p.x, this.p.y, 20, 100);
  }
}

class Planet {
  constructor(diameter, position, colors) {
    this.d = diameter;
    this.p = position;
    this.c = colors;
    this.dist = this.p.y-(height/2);
  }

  update(speed) {
    this.p.y += speed;
    this.dist = this.p.y-height/2;
    if(this.dist>this.d*4) {
      this.c[3][3] = this.c[3][3]-5;
    } else if(this.dist>this.d*2) {
      this.c[2][3] = this.c[2][3]-4;
    } else if(this.dist>this.d) {
      this.c[1][3] = this.c[1][3]-1;
    }
    this.c[0][3] = this.c[0][3]-0.5;
  }

  display() {
    noStroke();
    fill(this.c[3]);
    circle(width/2, this.p.y, this.d*8);
    fill(this.c[2]);
    circle(width/2, this.p.y, this.d*4);
    fill(this.c[1]);
    circle(width/2, this.p.y, this.d*2);
    fill(this.c[0]);
    circle(width/2, this.p.y, this.d);
  }
}