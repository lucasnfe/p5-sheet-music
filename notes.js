const noteStates = {
    "idle": 0,
    "selected": 1,
    "playing": 2
}

class Note {
  static idleColor = {r: 0, g: 0, b: 0};
  static selectedColor = {r: 232, g: 110, b: 88 };
  static playingColor = {r: 232, g: 110, b: 88 };

  static accidentalSize = 34;
  static accidentalOffset = {x: -15, y: 2};

  constructor(x, y, pitch, value, accidental = null) {
    this.x = x;
    this.y = y;
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

  static drawAccidental(x, y, accidental, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(Note.accidentalSize);

    switch (accidental) {
      case "#":
        text('', x + Note.accidentalOffset.x, y + Note.accidentalOffset.y);
        break;
      case "b":
        text('', x + Note.accidentalOffset.x, y + Note.accidentalOffset.y);
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
  static headSize = 40;
  static stemHeight = 29.5;
  static stemOffset = {x: 5.4, y: -1};

  constructor(x, y, pitch, value, accidental = null) {
    super(x, y, pitch, value, accidental);
  }

  static drawStem(x, y, isUp = true, state = "idle") {
    let orientation = isUp ? 1 : -1;

    Note.strokeColor(state);

    strokeCap(SQUARE);
    line(x + StemedNote.stemOffset.x * orientation,
         y + StemedNote.stemOffset.y * orientation,
         x + StemedNote.stemOffset.x * orientation,
         y + (StemedNote.stemOffset.y - StemedNote.stemHeight) * orientation);
  }

  // Assume filled head
  static drawHead(x, y, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(StemedNote.headSize);
    text('', x, y);
  }

  static aabb(x, y, isUp, font) {
    let bbox = font.textBounds('', x, y, StemedNote.headSize);

    if (isUp)
      bbox.y = y + (StemedNote.stemOffset.y - StemedNote.stemHeight);
    bbox.h = bbox.h/2 + StemedNote.stemHeight;

    return bbox;
  }
}

class StemedFlaggedNote extends StemedNote {
  static flagSize = 34;
  static flagOffset = {x: 0.5, y: 0};

  constructor(x, y, pitch, value, accidental = null) {
    super(x, y, pitch, value, accidental);
  }

  static drawFlag(x, y, upSymbol, downSymbol, isUp = true, state = "idle") {
    let symbol = isUp ? upSymbol : downSymbol;
    let orientation = isUp ? 1 : -1;
    x = x + StemedNote.stemOffset.x * orientation - StemedFlaggedNote.flagOffset.x;
    y = y + (StemedNote.stemOffset.y - StemedNote.stemHeight + StemedFlaggedNote.flagOffset.y) * orientation;

    Note.fillColor(state);

    noStroke();
    textAlign(LEFT);
    textSize(StemedFlaggedNote.flagSize);
    text(symbol, x, y);
  }
}

class WholeNote extends Note {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "1n", accidental);
  }

  static drawHead(x, y, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static aabb(x, y, font) {
    let bbox = font.textBounds('', x, y, 40);
    return bbox;
  }

  static draw(x, y, accidental = null, state = "idle") {
    WholeNote.drawHead(x, y, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}

class HalfNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "2n", accidental);
  }

  static drawHead(x, y, state) {
    Note.fillColor(state);

    noStroke();
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static draw(x, y, isUp = true, accidental = null, state = "idle") {
    StemedNote.drawStem(x, y, isUp, state);
    HalfNote.drawHead(x, y, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}

class QuarterNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "4n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, state = "idle") {
    StemedNote.drawStem(x, y, isUp, state);
    StemedNote.drawHead(x, y, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}

class EighthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "8n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, state = "idle") {
    StemedNote.drawStem(x, y, isUp, state);
    StemedNote.drawHead(x, y, state);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}

class SixteenthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "16n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, state = "idle") {
    StemedNote.drawStem(x, y, isUp, state);
    StemedNote.drawHead(x, y, state);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}

class ThirtySecondNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "32n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, state = "idle") {
    StemedNote.drawStem(x, y, isUp, state);
    StemedNote.drawHead(x, y, state);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, state);
    Note.drawAccidental(x, y, accidental, state);
  }
}
