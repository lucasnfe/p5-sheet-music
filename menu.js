
class MenuButton {
  static states = {
    "released": 0,
    "pressed":  1,
    "hovered":  2,
    "disabled": 4
  }

  constructor(x, y, w, h, pressCallback, releaseCallback) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pressCallback = pressCallback;
    this.releaseCallback = releaseCallback;
    this.setState("released");
  }

  update() {
    if (this.state == "disabled")
      return;

    // Update state
    if (this.isPointInside(mouseX, mouseY)) {
      if (this.state == "released") {
        this.setState("hovered");
      }
    }
    else {
      if (this.state == "hovered") {
        this.setState("released");
      }
    }
  }

  draw(font) {
    this.update();

    // Draw button
    // rect(this.x, this.y, this.w, this.h);
  }

  disable() {
    this.setState("disabled");
  }

  enable() {
    this.release();
  }

  pressed() {
    if (this.state == "disabled")
      return;

    if (this.state == "pressed") {
      this.release();
    }
    else {
      this.setState("pressed");
      if (this.pressCallback) {
        this.pressCallback();
      }

      // If this button is in a selector, disable all others.
      for (let selector of this.menu.selectors) {
        if (selector.buttons.includes(this)) {
          selector.select(this);
        }
      }
    }
  }

  release() {
    if (this.state == "pressed") {
      if (this.releaseCallback) {
        this.releaseCallback();
      }
    }

    this.setState("released");
  }

  mousePressed(x, y) {
    if (this.isPointInside(x,y)) {
      this.pressed();
    }
  }

  setState(state) {
    if (state in MenuButton.states) {
        this.state = state;
    }
  }

  isPointInside(x, y) {
    if (x >= this.x && x <= this.x + this.w &&
        y >= this.y && y <= this.y + this.h) {
        return true;
     }

    return false;
  }
}

class SymbolButton extends MenuButton {
  constructor(x, y, w, h, symbol, pressCallback, releaseCallback) {
    super(x, y, w, h, pressCallback, releaseCallback);
    this.symbol = symbol;
  }

  draw(font) {
    super.draw(font);

    const x = this.x + this.w/2;
    const y = this.y + this.h/2;
    const size = this.w/1.75;

    switch (this.state) {
      case "released":
        fill(0);
        break;
      case "pressed":
        fill(232, 110, 88);
        break;
      case "hovered":
        fill(150);
        break;
      case "disabled":
        fill(0, 0, 0, 100);
        break;
    }

    noStroke();
    textSize(size);
    textAlign(CENTER);

    const symbolBox = font.textBounds(this.symbol, x, y, size);
    text(this.symbol, x, y + symbolBox.h/2.5);
  }
}

class ImgButton extends MenuButton {
  constructor(x, y, w, h, imgSrc, pressedCallback, releaseCallback) {
    super(x, y, w, h, pressedCallback, releaseCallback)
    this.imgSrc = imgSrc;
  }

  draw(font) {
    super.draw(font);

    image(this.imgSrc, this.x, this.y, this.w, this.h);

    switch (this.state) {
      case "released":
        tint(255);
        break;
      case "pressed":
        tint(232, 110, 88);
        break;
      case "hovered":
        tint(255, 255, 255, 150);
        break;
      case "disabled":
        tint(250, 100);
        break;
    }
  }
}

class MenuSelector {
  constructor(size) {
    this.buttons = new Array(size);
  }

  select(button) {
    this.releaseAll();
    button.setState("pressed");
  }

  releaseAll() {
    for (let button of this.buttons) {
      button.setState("released");
    }
  }
}

class Menu {
  constructor(menuConfig) {
    this.x = menuConfig.x;
    this.y = menuConfig.y;
    this.width = menuConfig.width;
    this.height = menuConfig.height;

    this.buttonWidth = menuConfig.button.width;
    this.buttonHeight = menuConfig.button.height;

    this.currentAccidental = null;
    this.currentNoteValue = null;

    this.noteButtons = [];
    this.selectors = [];
  }

  draw(font) {
    // Draw background
    noStroke();
    fill(230);
    rect(this.x, this.y, this.width, this.height);

    // Draw buttons
    for (let button of this.noteButtons) {
      button.draw(font);
    }
  }

  disable() {
    for (let button of this.noteButtons) {
      button.disable();
    }
  }

  enable() {
    for (let button of this.noteButtons) {
      button.enable();
    }
  }

  releaseAll() {
    for (let button of this.noteButtons) {
      button.release();
    }
  }

  mousePressed(x, y) {
    for (let button of this.noteButtons) {
      button.mousePressed(x, y);
    }
  }

  setCurrentNoteValue(value) {
      this.currentNoteValue = value;
  }

  toggleCurrentAccidental(accidental) {
      this.currentAccidental = accidental;
  }

  createSymbolButton(symbol, column, pressCallback, releaseCallback) {
    let x = this.x + column * this.buttonWidth;
    let y = this.y + this.height/2 - this.buttonHeight/2;

    let button = new SymbolButton(x, y, this.buttonWidth, this.buttonHeight, symbol, pressCallback, releaseCallback);
    this.noteButtons.push(button);

    button.menu = this;

    return button;
  }

  createImgButton(imgSrc, column, pressCallback, releaseCallback) {
    let x = this.x + column * this.buttonWidth;
    let y = this.y + this.height/2 - this.buttonHeight/2;

    let button = new ImgButton(x, y, this.buttonWidth, this.buttonHeight, imgSrc, pressCallback, releaseCallback);
    this.noteButtons.push(button);

    button.menu = this;

    return button;
  }

  createSelector(size) {
    let selector = new MenuSelector(size);
    this.selectors.push(selector);
    return selector;
  }
}
