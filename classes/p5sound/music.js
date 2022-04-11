let monoSynth;
let rootNote = 60; // C4
let keys = []
let whiteKeys = 0;
let xPosition = 50;


function setup() {
    createCanvas(800,200);
    background(75);
    
    monoSynth = new p5.MonoSynth();

    for(let i=0; i<13; i++) {
        let keyName = i%12;
        let col = 255;
        if(keyName==0 || keyName==2 || keyName ==5 || keyName==7 || keyName==9){
            pos = createVector(xPosition, 75);
            xPosition += 25;
        } else if(keyName==1 || keyName ==3 || keyName==6 || keyName == 8|| keyName ==10) {
            pos = createVector(xPosition, 30);
            col = 0;
            xPosition += 25;
        } else {
            pos = createVector(xPosition, 75);
            xPosition += 50;
        }
        keys[i] = new Key(pos, 50, midiToFreq(rootNote+(i)), col);
        keys[i].display();
    }

}

function mousePressed() {
    for(let i=0; i<13; i++) {
        let distance = dist(mouseX, mouseY, keys[i].pos.x, keys[i].pos.y)
        if(distance<(keys[i].diam/2)) {
            keys[i].play();
        }
    }
}

function mouseReleased() {
    for(let i=0; i<13; i++) {
        keys[i].display();
    }
}

function draw() {

}

class Key {
    constructor(position, diameter, note, color) {
        this.pos = position;
        this.diam = diameter;
        this.note = note;
        this.color = color;
    }
    display() {
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.diam);
    }
    play() {
            monoSynth.play(this.note, 1, 0, 1/6);
            push();
            fill(color(0, 200, 200));
            circle(this.pos.x, this.pos.y, this.diam);
            pop();
    }
}