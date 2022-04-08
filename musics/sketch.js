
let trail = new Array(60);
let soundfile, amplitude;

function preload(){
  soundfile = loadSound('C:\Users\Michael\Documents\StThomas\CISC 298\musics\Broke For Free - Night Owl.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
  amplitude.setInput(soundfile);
  amplitude.smooth(0.6);
  soundfile.play();
}



function draw() {
  background(220);
  frameRate(10);
  //variables
  let obj = {
    yPosition: height/2,
    height: amplitude.getLevel()
  }
  //add latest object to the end of the array
  trail.push(obj);
  //remove the oldest object from the beginning of the array
  trail.shift();
  //loop through all levels of the array
  for(let i=0; i<trail.length; i++) {
    let dot = trail[i];
    if(dot != null) {
      fill(0);
      console.log(dot.height);
      let x = map(i, trail.length, 0, width, 0);
      circle(x, dot.yPosition, dot.diam);
    }
  }
}


function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
