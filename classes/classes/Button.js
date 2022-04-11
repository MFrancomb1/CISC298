
class Button {
    /**
     * @param  {int} size
     * @param  {p5.Vector} position
     * @param  {string} color
     */
    constructor(size, position, color) {
        this.size = size;
        this.p = position;
        this.mouseOn = false;
        this.colorString = color;
        this.c = color(color);
        this.isOn = false;
    }

    mouseOver() {
        if (mouseX < this.p.x + this.size / 2 && mouseX > this.p.x - this.size / 2 && mouseY < this.p.y + this.size / 2 && mouseY > this.p.y - this.size / 2) {
            this.mouseOn = true;
            this.c = color(this.colorString);
        } else {
            this.mouseOn = false;
            this.c = color(155);
        }
    }

    display() {
        push();
        rectMode(CENTER);
        fill(this.c);
        translate(this.p.x, this.p.y);
        rect(0, 0, this.size, this.size, 20);
        fill(30);
        if (song.isPlaying()) {
            rect(10, 0, this.size / 4, this.size * .7);
            rect(-10, 0, this.size / 4, this.size * .7);
        } else {
            triangle(-20, 20, -20, -20, 20, 0);
        }
        textSize(12);
        text("Press button or spacebar", -this.size + 10, this.size - 10);
        rectMode(CORNER);
        pop();
    }

    pressed() {
        if (this.mouseOn) {
            return true;
        }
    }

}