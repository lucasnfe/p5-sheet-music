const noteStates = {
    "idle": 0,
    "selected": 1,
    "playing": 2
}

class Note {
  static idleColor = {r: 0, g: 0, b: 0};
  static selectedColor = {r: 232, g: 110, b: 88 };
  static playingColor = {r: 232, g: 110, b: 88 };

  constructor(x, y, size, pitch, value, accidental = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.pitch = pitch;
    this.value = value;
    this.accidental = accidental;
    this.state = this.setState("idle");
  }

  select() {
    this.setState("selected");
  }

  deselect() {
    this.setState("idle");
  }

  isIdle() {
    return this.state == "idle";
  }

  isSelected() {
    return this.state == "selected";
  }

  isPlaying() {
    return this.state == "playing";
  }

  updatePosition(x, y, pitch) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
  }

  setState(state) {
    if (state in noteStates) {
      this.state = state;
    }
  }

  static fillColor(state) {
    switch (state) {
      case "idle":
        fill(Note.idleColor.r, Note.idleColor.g, Note.idleColor.b);
        break;
      case "selected":
        fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
        break;
      case "playing":
        fill(Note.playingColor.r, Note.playingColor.g, Note.playingColor.b);
        break;
    }
  }

  static strokeColor(state) {
    switch (state) {
      case "idle":
        stroke(Note.idleColor.r, Note.idleColor.g, Note.idleColor.b);
        break;
      case "selected":
        stroke(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
        break;
      case "playing":
        stroke(Note.playingColor.r, Note.playingColor.g, Note.playingColor.b);
        break;
    }
  }

  static accidentalBoundingBox(x, y, font, size, accidental) {
    let accidentalBox = {x: 0, y: 0, w: 0, h: 0};

    switch (accidental) {
      case "#":
        accidentalBox = font.textBounds('', x, y, size);
        break;
      case "b":
        accidentalBox = font.textBounds('', x, y, size);
        break;
    }

    return accidentalBox;
  }

  static drawAccidental(x, y, size, accidental, state = "idle") {
    Note.fillColor(state);

    noStroke();
    textSize(size);
    textAlign(CENTER);

    switch (accidental) {
      case "#":
        text('', x, y);
        break;
      case "b":
        text('', x, y);
        break;
    }
  }

  getPitch() {
    let pitch = this.pitch;

    if (this.accidental == "#") {
      pitch += 1;
    }
    else if (this.accidental == "b") {
      pitch -= 1;
    }

    return pitch;
  }
}

class StemedNote extends Note {
  constructor(x, y, pitch, value, accidental = null) {
    super(x, y, pitch, value, accidental);
  }

  static drawStem(x, y, height, isUp = true, state = "idle") {
    strokeCap(SQUARE);
    Note.strokeColor(state);

    const up = isUp ? 1 : -1;
    line(x, y, x, y - height * up);
  }

  // Assume filled head
  static drawHead(x, y, size, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(size);
    text('', x, y);
  }

  static headBoundingBox(x, y, font, size) {
    let headBox = font.textBounds('', x, y, size);
    return headBox;
  }

  static stemHeight(headHeight) {
    const stemHeight = headHeight * 3;
    return stemHeight;
  }

  static noteBoundingBox(x, y, font, size, isUp) {
    const headBox = StemedNote.headBoundingBox(x, y, font, size);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    if (isUp)
      headBox.y -= stemHeight - headBox.h/2;
    headBox.h += stemHeight - headBox.h/2;

    return headBox;
  }
}

class StemedFlaggedNote extends StemedNote {
  constructor(x, y, pitch, value, accidental = null) {
    super(x, y, pitch, value, accidental);
  }

  static drawFlag(x, y, size, upSymbol, downSymbol, isUp = true, state = "idle") {
    const symbol = isUp ? upSymbol : downSymbol;
    const up = isUp ? 1 : -1;

    Note.fillColor(state);

    noStroke();
    textAlign(LEFT);
    textSize(size);
    text(symbol, x, y);
  }
}

class WholeNote extends Note {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "1n", accidental);
  }

  static drawHead(x, y, size, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(size);
    text('', x, y);
  }

  static noteBoundingBox(x, y, font, size) {
    let bbox = font.textBounds('', x, y, size);
    return bbox;
  }

  static draw(x, y, font, size, accidental = null, state = "idle") {
    const headBox = WholeNote.noteBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);

    WholeNote.drawHead(x, y, size, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}

class HalfNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "2n", accidental);
  }

  static drawHead(x, y, size, state) {
    Note.fillColor(state);

    noStroke();
    textSize(size);
    textAlign(CENTER);
    text('', x, y);
  }

  static headBoundingBox(x, y, font, size) {
    let headBox = font.textBounds('', x, y, size);
    return headBox;
  }

  static noteBoundingBox(x, y, font, size, isUp) {
    const headBox = HalfNote.headBoundingBox(x, y, font, size);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    if (isUp)
      headBox.y -= stemHeight - headBox.h/2;
    headBox.h += stemHeight - headBox.h/2;

    return headBox;
  }

  static draw(x, y, font, size, isUp = true, accidental = null, state = "idle") {
    const up = isUp ? 1 : -1;
    const headBox = HalfNote.headBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);
    const stemHeight = HalfNote.stemHeight(headBox.h);

    StemedNote.drawStem(x + headBox.w/2 * up, y, stemHeight, isUp, state);
    HalfNote.drawHead(x, y, size, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}

class QuarterNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "4n", accidental);
  }

  static draw(x, y, font, size, isUp = true, accidental = null, state = "idle") {
    const up = isUp ? 1 : -1;
    const headBox = StemedNote.headBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    StemedNote.drawStem(x + headBox.w/2 * up, y, stemHeight, isUp, state);
    StemedNote.drawHead(x, y, size, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}

class EighthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "8n", accidental);
  }

  static draw(x, y, font, size, isUp = true, accidental = null, state = "idle") {
    const up = isUp ? 1 : -1;
    const headBox = StemedNote.headBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    StemedNote.drawStem(x + headBox.w/2 * up, y, stemHeight, isUp, state);
    StemedNote.drawHead(x, y, size, state);
    StemedFlaggedNote.drawFlag(x + headBox.w/2 * up - 0.5,
                               y - stemHeight * up, size,
                               '', '', isUp, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}

class SixteenthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "16n", accidental);
  }

  static draw(x, y, font, size, isUp = true, accidental = null, state = "idle") {
    const up = isUp ? 1 : -1;
    const headBox = StemedNote.headBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    StemedNote.drawStem(x + headBox.w/2 * up, y, stemHeight, isUp, state);
    StemedNote.drawHead(x, y, size, state);
    StemedFlaggedNote.drawFlag(x + headBox.w/2 * up - 0.5,
                               y - stemHeight * up, size,
                               '', '', isUp, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}

class ThirtySecondNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "32n", accidental);
  }

  static draw(x, y, font, size, isUp = true, accidental = null, state = "idle") {
    const up = isUp ? 1 : -1;
    const headBox = StemedNote.headBoundingBox(x, y, font, size);
    const accidentalBox = Note.accidentalBoundingBox(x, y, font, size, accidental);
    const stemHeight = StemedNote.stemHeight(headBox.h);

    StemedNote.drawStem(x + headBox.w/2 * up, y, stemHeight, isUp, state);
    StemedNote.drawHead(x, y, size, state);
    StemedFlaggedNote.drawFlag(x + headBox.w/2 * up - 0.5,
                               y - stemHeight * up, size,
                               '', '', isUp, state);
    Note.drawAccidental(x - headBox.w/2 - accidentalBox.w/1.5, y, size, accidental, state);
  }
}
