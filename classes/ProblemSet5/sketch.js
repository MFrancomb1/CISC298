let gui = new dat.GUI();
let frame = 0;

let options = {
  xRotation: 1,
  yRotation: 0,
  zRotation: 0,
  pause: false,
  color: [ 0, 128, 255 ]
};

gui.add(options, 'xRotation').min(-10).max(10).step(1);
gui.add(options, 'yRotation').min(-10).max(10).step(1);
gui.add(options, 'zRotation').min(-10).max(10).step(1);
gui.add(options, 'pause');
gui.addColor(options, 'color');

let cube;

function setup() {
  createCanvas(1600, 900, WEBGL);
  cube = new Cube();
}

function draw() {
  if(!options.pause){
    background(200);
    //cube.move();
    cube.display();
    frame+=1;
  }
}

class Cube {
  constructor() {
    this.position = createVector(0, 0, 0);
  }
  
  display() {
    push();
    translate(this.position);
    rotateX(frame*0.005*(options.xRotation));
    rotateY(frame*0.005*(options.yRotation));
    rotateZ(frame*0.005*(options.zRotation));
    strokeWeight(4);
    fill(options.color);
    box(200);
    pop();
  }
  
}
