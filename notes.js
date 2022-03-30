
class Note {
  static selectedColor = {r: 232, g: 110, b: 88}
  static accidentalSize = 34;
  static accidentalOffset = {x: -15, y: 2};

  constructor(x, y, pitch, value, accidental = null) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
    this.value = value;
    this.accidental = accidental;
    this.isSelected = false;
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }

  updatePosition(x, y, pitch) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
  }

  static drawAccidental(x, y, accidental, isSelected = false) {
    if (isSelected)
      fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      fill("black");

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

  static drawStem(x, y, isUp = true, isSelected = false) {
    strokeCap(SQUARE);
    if (isSelected)
      stroke(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      stroke("black");

    let orientation = isUp ? 1 : -1;
    line(x + StemedNote.stemOffset.x * orientation,
         y + StemedNote.stemOffset.y * orientation,
         x + StemedNote.stemOffset.x * orientation,
         y + (StemedNote.stemOffset.y - StemedNote.stemHeight) * orientation);
  }

  // Assume filled head
  static drawHead(x, y, isSelected = false) {
    if (isSelected)
      fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      fill("black");

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

  static drawFlag(x, y, upSymbol, downSymbol, isUp = true, isSelected = false) {
    let symbol = isUp ? upSymbol : downSymbol;
    let orientation = isUp ? 1 : -1;
    x = x + StemedNote.stemOffset.x * orientation - StemedFlaggedNote.flagOffset.x;
    y = y + (StemedNote.stemOffset.y - StemedNote.stemHeight + StemedFlaggedNote.flagOffset.y) * orientation;

    if (isSelected)
      fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      fill("black");

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

  static drawHead(x, y, isSelected = false) {
    if (isSelected)
      fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      fill("black");

    noStroke();
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static aabb(x, y, font) {
    let bbox = font.textBounds('', x, y, 40);
    return bbox;
  }

  static draw(x, y, accidental = null, isSelected = false) {
    WholeNote.drawHead(x, y, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}

class HalfNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "2n", accidental);
  }

  static drawHead(x, y, isSelected) {
    if (isSelected)
      fill(Note.selectedColor.r, Note.selectedColor.g, Note.selectedColor.b);
    else
      fill("black");

    noStroke();
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static draw(x, y, isUp = true, accidental = null, isSelected = false) {
    StemedNote.drawStem(x, y, isUp, isSelected);
    HalfNote.drawHead(x, y, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}

class QuarterNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "4n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, isSelected = false) {
    StemedNote.drawStem(x, y, isUp, isSelected);
    StemedNote.drawHead(x, y, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}

class EighthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "8n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, isSelected = false) {
    StemedNote.drawStem(x, y, isUp, isSelected);
    StemedNote.drawHead(x, y, isSelected);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}

class SixteenthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "16n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, isSelected = false) {
    StemedNote.drawStem(x, y, isUp, isSelected);
    StemedNote.drawHead(x, y, isSelected);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}

class ThirtySecondNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "32n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null, isSelected = false) {
    StemedNote.drawStem(x, y, isUp, isSelected);
    StemedNote.drawHead(x, y, isSelected);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp, isSelected);
    Note.drawAccidental(x, y, accidental, isSelected);
  }
}
