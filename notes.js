
class Note {
  static accidentalSize = 34;
  static accidentalOffset = {x: -15, y: 2};

  constructor(x, y, pitch, value, accidental = null) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
    this.value = value;
    this.accidental = accidental;
  }

  static drawAccidental(x, y, accidental) {
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

  static drawStem(x, y, isUp = true) {
    strokeCap(SQUARE);

    let orientation = isUp ? 1 : -1;
    line(x + StemedNote.stemOffset.x * orientation,
         y + StemedNote.stemOffset.y * orientation,
         x + StemedNote.stemOffset.x * orientation,
         y + (StemedNote.stemOffset.y - StemedNote.stemHeight) * orientation);
  }

  // Assume filled head
  static drawHead(x, y) {
    textAlign(CENTER);
    textSize(StemedNote.headSize);
    text('', x, y);
  }
}

class StemedFlaggedNote extends StemedNote {
  static flagSize = 34;
  static flagOffset = {x: 0.5, y: 0};

  constructor(x, y, pitch, value, accidental = null) {
    super(x, y, pitch, value, accidental);
  }

  static drawFlag(x, y, upSymbol, downSymbol, isUp = true) {
    let symbol = isUp ? upSymbol : downSymbol;
    let orientation = isUp ? 1 : -1;
    x = x + StemedNote.stemOffset.x * orientation - StemedFlaggedNote.flagOffset.x;
    y = y + (StemedNote.stemOffset.y - StemedNote.stemHeight + StemedFlaggedNote.flagOffset.y) * orientation;

    textAlign(LEFT);
    textSize(StemedFlaggedNote.flagSize);
    text(symbol, x, y);
  }
}

class WholeNote extends Note {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "1n", accidental);
  }

  static drawHead(x, y) {
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static draw(x, y, accidental = null) {
    WholeNote.drawHead(x, y);
    Note.drawAccidental(x, y, accidental);
  }
}

class HalfNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "2n", accidental);
  }

  static drawHead(x, y) {
    textAlign(CENTER);
    textSize(40);
    text('', x, y);
  }

  static draw(x, y, isUp = true, accidental = null) {
    StemedNote.drawStem(x, y, isUp);
    HalfNote.drawHead(x, y);
    Note.drawAccidental(x, y, accidental);
  }
}

class QuarterNote extends StemedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "4n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null) {
    StemedNote.drawStem(x, y, isUp);
    StemedNote.drawHead(x, y);
    Note.drawAccidental(x, y, accidental);
  }
}

class EighthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "8n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null) {
    StemedNote.drawStem(x, y, isUp);
    StemedNote.drawHead(x, y);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp);
    Note.drawAccidental(x, y, accidental);
  }
}

class SixteenthNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "16n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null) {
    StemedNote.drawStem(x, y, isUp);
    StemedNote.drawHead(x, y);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp);
    Note.drawAccidental(x, y, accidental);
  }
}

class ThirtySecondNote extends StemedFlaggedNote {
  constructor(x, y, pitch, accidental = null) {
    super(x, y, pitch, "32n", accidental);
  }

  static draw(x, y, isUp = true, accidental = null) {
    StemedNote.drawStem(x, y, isUp);
    StemedNote.drawHead(x, y);
    StemedFlaggedNote.drawFlag(x, y, '', '', isUp);
    Note.drawAccidental(x, y, accidental);
  }
}
