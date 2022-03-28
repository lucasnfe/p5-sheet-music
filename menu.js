const MENU_DEFAULT_NOTE_VALUE = "4n";

class Menu {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.currentAccidental = null;
    this.currentNoteValue = MENU_DEFAULT_NOTE_VALUE;
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

    button.position(this.x + column * 32, this.height/2);
    button.size(32, 32);
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

    button.position(this.x + column * 32, this.height/2);
    button.size(32, 32);
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
