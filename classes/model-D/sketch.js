let song;
let button;
let amp;
let prevLevels = [];
let fft;
let a = 0;
let filterControl;
let colorPalette = ["#9ADCFF", "#FFF89A", "#FFB2A6", "#FF8AAE"];
let filter;

function preload() {
  song = loadSound("Drumonades.mp3");
}

function setup() {
  createCanvas(1000, 1000);
  song.play();

  button = createButton('Pause');
  button.mousePressed(pauseSong);

  amp = new p5.Amplitude();
  fft = new p5.FFT();

  filter = new p5.Filter();
  song.disconnect();
  song.connect(filter);
  filterControl = new Draggable();
}

function draw() {
  background(colorPalette[0]);
  let volume = amp.getLevel();
  let spectrum = fft.analyze();

  noStroke();
  fill(0);
  for(let i=0; i<spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width*1.3);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, (width/spectrum.length)+5, h/2);
  }

  prevLevels.push(volume);
  console.log(volume);

  stroke(0);
  if(prevLevels[prevLevels.length-1]>0.18){
    a = 255;
  }
  fill(color(255, 248, 145, a));
  if(a>0) {
    a = a-5;
  }
  let x = 0;
  for(let i=0; i<prevLevels.length; i++) {  
      let h = map(prevLevels[i], 0, 1, 0, height*1.5);
      rect(x, 0, 10, h);
      x += 10;
  }

  if(prevLevels.length>(width/10)) {
    prevLevels.splice(0, 1);
  }

  fill(colorPalette[2]);
  rect(width-310, (height/2)-150, 300, 300);

  filterControl.update();
  filterControl.over();
  filterControl.show();
  let thresh = map(filterControl.x, width-310, width-35, 20, 20000);
  filter.freq(thresh);
}

function mousePressed() {
  filterControl.pressed();
}

function mouseReleased() {
  filterControl.released();
}

function pauseSong() {
  if(song.isPlaying()) {
    song.pause();
  } else {
    song. play();
  }
}

class Draggable {
  constructor() {
    this.dragging = false;
    this.rollover = false;
    this.x = width-155;
    this.y = height/2;
    this.w = 25;
    this.h = 25;
  }
  over() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }
  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      if (this.x<width-310) {
        this.x = width-310;
      } else if(this.x>width-35) {
        this.x = width-35;
      }
      if (this.y>(height/2)+125) {
        this.y = (height/2)+125;
      } else if(this.y<(height/2)-150) {
        this.y = (height/2)-150;
      }
    }
  }
  show() {
    stroke(0);
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    rect(this.x, this.y, this.w, this.h);
  }
  pressed() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }
  released() {
    this.dragging = false;
  }
}