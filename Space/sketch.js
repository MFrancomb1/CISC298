
let colorPalette = [[154, 6, 128, 255], [121, 1, 140, 255], [76, 0, 112, 255], [22, 0, 64, 255]];
let withinSight;
let startingPoint;
let pauseButton;
let song;
let takeoff;
let rocket;
let img;
let planet;
let p= 0;
let planetDiam = 2500;
let filter;
let reverb;

function preload() {
  song = loadSound('Drumonades.mp3');
  img = loadImage('rocket.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startingPoint = createVector(width/2, height/2+planetDiam/2);
  planet = new Planet(planetDiam, startingPoint, colorPalette);
  rocket = new Rocket(createVector(startingPoint.x-50, height/2-175), 2);
  pauseButton = new PauseButton();
  filterLow = new p5.LowPass();
  filterHigh = new p5.HighPass();
  reverb = new p5.Reverb();
  song.disconnect();
  song.connect(filterHigh);
  song.connect(filterLow);
  //song.connect(reverb);
  


  song.play();
}

function draw() {
  background(8, 0, 35);
  planet.display();
  rocket.update();
  filterLow.freq(map(rocket.p.y, height/2, height-150, 20, 20000));
  filterHigh.freq(map(rocket.p.y, 50, height/2, 20000, 20));

  rocket.over();
  rocket.display();
  planet.update(rocket.speed);
  pauseButton.display();
  pauseButton.mouseOver();
  console.log();
  fill(0);
  rect(rocket.p.x, rocket.p.y, 4, 4);
}

function mousePressed() {
  pauseButton.pressed();
  rocket.pressed();
}

function mouseReleased() {
  rocket.released();
}

function keyPressed() {
  if(keyCode === 32) {
    pause();
  }
}

function pause() {
  if(song.isPlaying()) {
    song.pause();
    frameRate(0);
  } else {
    song.play();
    frameRate(60);
  }
}

class Rocket {
  constructor(position, speed) {
    this.p = position;
    this.speed = speed;
    this.dragging = false;
    this.rollover = false;
    this.w = 100;
    this.h = 175;
  }

  over() {
    if (mouseX>this.p.x && mouseX<this.p.x+this.w && mouseY>this.p.y-this.h && mouseY<this.p.y+this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    if(this.dragging) {
      this.p.x = mouseX + this.offsetX;
      this.p.y = mouseY + this.offsetY;
    }
  }

  display() {
    image(img, this.p.x, this.p.y, this.w, this.h);
  }

  pressed() {
    if(mouseX>this.p.x && mouseX<this.p.x+this.w && mouseY>this.p.y && mouseY<this.p.y+this.h) {
      this.dragging = true;
      this.offsetX = this.p.x - mouseX;
      this.offsetY = this.p.y - mouseY;
    }
  }

  released() {
    this.dragging = false;
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
    circle(width/2, this.p.y, this.d*7.5);
    fill(this.c[2]);
    circle(width/2, this.p.y, this.d*4);
    fill(this.c[1]);
    circle(width/2, this.p.y, this.d*2);
    fill(this.c[0]);
    circle(width/2, this.p.y, this.d);
  }
}

class PauseButton {
  constructor() {
    this.sides = 60;
    this.position = createVector((this.sides/2)+20, (this.sides/2)+20);
    this.mouseOn = false;
    this.c = 155;
  }

  mouseOver() {
    if (mouseX<this.position.x+this.sides/2 && mouseX>this.position.x-this.sides/2 && mouseY<this.position.y+this.sides/2 && mouseY>this.position.y-this.sides/2) {
      this.mouseOn = true;
      this.c = 250;
    } else {
      this.mouseOn = false;
      this.c = 155;
    }
  }

  display() {
    push();
    rectMode(CENTER);
    fill(this.c);
    translate(this.position.x, this.position.y);
    rect(0, 0, this.sides, this.sides, 20);
    fill(30);
    if(song.isPlaying()) {
    rect(10, 0, this.sides/4, this.sides*.7);
    rect(-10, 0, this.sides/4, this.sides*.7);
    } else {
      triangle(-20, 20, -20, -20, 20, 0);
    }
    textSize(12);
    text("Press button or spacebar", -this.sides+10, this.sides-10);
    rectMode(CORNER);
    pop();
  }

  pressed() {
    if(this.mouseOn) {
      if(song.isPlaying()) {
        pause();
      } else {
        pause();
      }
    }
  }
}