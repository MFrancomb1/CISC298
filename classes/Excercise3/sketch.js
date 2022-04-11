let song;
let pauseButton;
let amp;
let prevLevels = [];
let fft;
let a = 0;
let filterControl;
let filter;
let rocket;
let rocketStream;

function preload() {
  song = loadSound('Drumonades.mp3');
}

function setup() {
  createCanvas(1000, 1000);
  song.play();

  pauseButton = new PauseButton();

  filterControl = new Slider(width/2, 100, 25, "filter");
  filter = new p5.Filter();
  
  amp = new p5.Amplitude();
  fft = new p5.FFT();

  song.disconnect();
  song.connect(filter);

  let rocketVector = createVector(width/2, height-(height/1.5));
  rocket = new Rocket(rocketVector);
  rocketStream = new Stream(rocketVector);
}

function draw() {
  background(220);

  let vol = amp.getLevel();
  let spectrum = fft.analyze();

  prevLevels.push(vol);
  rocketStream.update(spectrum, rocket.x);
  rocketStream.display();

  if(vol>0.2) {
    a = 255;
  }
  if(a>0) {
    a -= 5;
  }
  let y = 0;
  for(let i=0; i<prevLevels.length; i++) {
    let w = map(prevLevels[i], 0, 1, 0, width*1.5);
    fill(0, a);
    rect(0, y, w, 10);
    rect(width, y, -w, 10);
    y += 10;
  }
  if(prevLevels.length>width/10) {
    prevLevels.splice(0,1);
  }

  pauseButton.display();
  pauseButton.mouseOver();

  filterControl.update();
  filterControl.mouseOver();
  filterControl.display();
  let threshold = map(filterControl.p.x, filterControl.outerP.x-filterControl.outerW/2, filterControl.outerP.x+filterControl.outerW/2, 20, 20000);
  filter.freq(threshold);

  rocket.update(threshold);
  rocket.display();
}

function mousePressed() {
  pauseButton.pressed();
  filterControl.pressed();
}
function mouseReleased() {
  filterControl.released();
}
function keyPressed() {
  if(keyCode === 32) {
    if(song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
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
        song.pause();
      } else {
        song.play();
      }
    }
  }
}

class Slider {
  constructor(x, y, size, name) {
    this.dragging = false;
    this.over = false;
    this.p = createVector(x, y);
    this.outerP = createVector(x, y);
    this.w = size;
    this.h = size;
    this.outerW = this.w*10;
    this.name = name;
  }

  mouseOver() {
    if (mouseX > this.p.x-this.w/2 && mouseX < this.p.x + this.w/2 && mouseY > this.p.y-this.h/2 && mouseY < this.p.y + this.h/2) {
      this.over = true;
    } else {
      this.over = false;
    }
  }

  update() {
    if (this.dragging) {
      this.p.x = mouseX + this.offsetX;
      if (this.p.x<this.outerP.x-(this.outerW/2)+(this.w/2)) {
        this.p.x = this.outerP.x-(this.outerW/2)+(this.w/2);
      } else if(this.p.x>this.outerP.x+(this.outerW/2)-(this.w/2)) {
        this.p.x = this.outerP.x+(this.outerW/2)-(this.w/2);
      }
    }
  }
  display() {
    stroke(0);
    rectMode(CENTER);
    fill(0);
    rect(this.outerP.x, this.outerP.y, this.outerW, this.h);
    textSize(this.h);
    fill(255);
    text(this.name, this.outerP.x-this.outerW/2, this.outerP.y+this.h/2)
    if (this.dragging) {
      fill(50);
    } else if (this.over) {
      fill(100);
    } else {
      fill(175, 200);
    }
    rect(this.p.x, this.p.y, this.w, this.h);
    rectMode(CORNER);
  }

  pressed() {
    if (this.over) {
      this.dragging = true;
      this.offsetX = this.p.x - mouseX;
    }
  }
  released() {
    this.dragging = false;
  }

}

class Rocket {
  constructor(position) {
    this.x = position.x;
    this.y = position.y;
    this.destination;
    this.dx = 1;
    this.offsetAngle = 0;
  }

  update(x) {
    this.destination = map(x, 20, 20000, 0, width);
  }

  display() {
    push();
    translate(this.x, this.y);
    if(this.x != this.destination){
      rotate(this.offsetAngle);
    }
    rectMode(CENTER);
    angleMode(DEGREES);
    fill(0);
    rect(0, 80, 100, 160);
    triangle(-50, 0, 50, 0, 0, -75);
    triangle(-50, 80, -50, 150, -70, 150);
    triangle(50, 80, 50, 150, 70, 150);

    if(this.x > this.destination) {

      rotate(15);
      this.offsetAngle = -15;
      this.x -= this.dx;
    } else if(this.x<this.destination) {
      rotate(-15);
      this.offsetAngle = 15;
      this.x += this.dx;
    }

    rectMode(CORNER);
    pop();
  }

}

class Stream {
  constructor(position) {
    this.x = position.x;
    this.y = position.y+160;
    this.levels;
  }

  update(levels, x) {
    this.levels = levels;
    this.x = x;
  }

  display() {
      for(let i = 0; i<this.levels.length; i++) {
        rectMode(CENTER);
        let y = map(i, 0, this.levels.length, this.y, height+100);
        let w = -width + map(this.levels[i], 0, 255, width, 0);
        rect(this.x, y, w, (height-this.y)/this.levels.length);
        rectMode(CORNER);
      }
    }
}
