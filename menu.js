
class Menu {
  constructor(menuConfig) {
    this.x = menuConfig.x;
    this.y = menuConfig.y;
    this.width = menuConfig.width;
    this.height = menuConfig.height;

    this.buttonWidth = menuConfig.button.width;
    this.buttonHeight = menuConfig.button.height;

    this.currentAccidental = null;
    this.currentNoteValue = menuConfig.defaultNoteValue;
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
