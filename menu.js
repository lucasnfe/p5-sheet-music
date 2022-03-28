
class Menu {
  constructor(x, y, width, height, buttonWidth=32, buttonHeight=32, defaultNoteValue="4n") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;

    this.currentAccidental = null;
    this.currentNoteValue = defaultNoteValue;
  }

  draw() {
    push();

    noStroke();
    fill(230);
    rect(this.x, this.y, this.width, this.height)

    pop();
  }

  setCurrentNoteValue(value) {
    this.currentNoteValue = value;
  }

  toggleCurrentAccidental(accidental) {
    if (this.currentAccidental == accidental) {
      this.currentAccidental = null;
    }
    else {
      this.currentAccidental = accidental;
    }
  }

  createTextButton(text, column, callback) {
    let button = createButton(text);

    button.position(this.x + column * this.buttonWidth, this.y + this.height/2 - this.buttonHeight/2);
    button.size(this.buttonWidth, this.buttonHeight);
    button.mousePressed(callback);

    button.mouseOver(() => {
        button.style("opacity: 0.5;")
    });

    button.mouseOut(() => {
        button.style("opacity: 1.0;")
    });

    return button
  }

  createImgButton(srcImage, column, callback) {
    let button = createImg(srcImage);

    button.position(this.x + column * this.buttonWidth, this.y + this.height/2 - this.buttonHeight/2);
    button.size(this.buttonWidth, this.buttonHeight);
    button.mousePressed(callback);

    button.mouseOver(() => {
        button.style("opacity: 0.5;")
    });

    button.mouseOut(() => {
        button.style("opacity: 1.0;")
    });

    return button
  }
}
