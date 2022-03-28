const STAFF_SPACE_HEIGHT = 10;

const CLEF_OFFSET_X = 10;
const CLEF_OFFSET_Y = 32;
const CLEF_SIZE = 34;

const TIME_SIGNATURE_OFFSET_X = 0;
const TIME_SIGNATURE_OFFSET_Y = 37;
const TIME_SIGNATURE_SIZE = 34;

const C_MAJOR = [59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];

class Staff {
  constructor(x, y, width, n_lines, n_bars, clef, time_signature) {
    this.x = x;
    this.y = y;
    this.width = width;

    this.n_lines = n_lines;
    this.n_bars = n_bars;

    this.clef = clef;
    this.time_signature = time_signature;

    this.notes = [];

    this.horDrawableStart = this.x + CLEF_OFFSET_X + CLEF_SIZE + TIME_SIGNATURE_OFFSET_X + TIME_SIGNATURE_SIZE;
    this.horDrawableEnd = this.x + this.width;
    this.verDrawableStart = this.y - 1.5 * STAFF_SPACE_HEIGHT;
    this.verDrawableEnd = this.y + (this.n_lines + 1) * STAFF_SPACE_HEIGHT;
  }

  draw() {
    // Draw clef
    this.drawClef();

    // Draw time signature
    this.drawTimeSignature();

    // Draw lines
    this.drawLines();

    // Draw Bars
    this.drawBars();

    // Draw Notes
    for (let note of this.notes) {
      this.drawNote(note.x, note.y, note.value, note.accidental);
    }
  }

  drawClef() {
    textSize(CLEF_SIZE);
    switch (this.clef) {
      case "treble":
        text('', this.x + CLEF_OFFSET_X, this.y + CLEF_OFFSET_Y);
        break;
      default:
    }
  }

  drawTimeSignature() {
    textSize(TIME_SIGNATURE_SIZE);
    switch (this.time_signature) {
      case "4/4":
        text('', this.x + CLEF_OFFSET_X + CLEF_SIZE + TIME_SIGNATURE_OFFSET_X,
                  this.y + TIME_SIGNATURE_OFFSET_Y);
        break;
      default:

    }
  }

  drawLines() {
    for(let i = 0; i < this.n_lines; i++) {
      strokeWeight(1.0);
      line(this.x,
           this.y + STAFF_SPACE_HEIGHT * i,
           this.x + this.width,
           this.y + STAFF_SPACE_HEIGHT * i);
    }
  }

  drawBars() {
    let bar_width = (this.horDrawableEnd - this.horDrawableStart)/this.n_bars;

    for (let i = 0; i < this.n_bars; i++) {
      strokeWeight(1.5);
      line(this.horDrawableStart + bar_width * (i + 1),
           this.y,
           this.horDrawableStart + bar_width * (i + 1),
           this.y + STAFF_SPACE_HEIGHT * (STAFF_LINES - 1));
    }
  }

  drawNote(x, y, value, accidental) {
    const staffIndex = this.canvasPos2StaffIndex(y);
    const staffPos = this.canvasPos2StaffPos(y);

    let isUpSideDown = staffIndex >= 7;
    const noteChar = Note.getChar(value, isUpSideDown);

    // Draw note
    textSize(NOTE_SIZE);
    text(noteChar, x + NOTE_OFFSET_X, staffPos + NOTE_OFFSET_Y);

    // Draw accidental
    switch (accidental) {
      case "#":
        text('', x + NOTE_OFFSET_X - 10, staffPos + NOTE_OFFSET_Y);
        break;
      case "b":
        text('', x + NOTE_OFFSET_X - 10, staffPos + NOTE_OFFSET_Y);
        break;
    }

    // draw ledger line
    if (staffIndex == 1 || staffIndex == 13) {
      line(x - NOTE_SIZE/4, staffPos, x + NOTE_SIZE/4, staffPos);
    }
  }

  addNote(x, y, value, accidental) {
    let note = new Note(x, y, staff.canvasPos2Pitch(y), value, accidental);
    this.notes.push(note);
  }

  isInHorizontalBoundaries(x) {
    if (x >= this.horDrawableStart && x <= this.horDrawableEnd) {
          return true;
    }
    return false;
  }

  isInVerticalBoundaries(y) {
    if (y >= this.verDrawableStart && y <= this.verDrawableEnd) {
      return true;
    }
    return false;
  }

  isInStaff(x, y) {
    if (this.isInHorizontalBoundaries(x) && this.isInVerticalBoundaries(y)) {
      return true;
    }

    return false;
  }

  canvasPos2Pitch(y) {
    let staffIndex = staff.canvasPos2StaffIndex(y);
    return C_MAJOR[staffIndex];
  }

  canvasPos2StaffPos(y) {
    let staffIndex = staff.canvasPos2StaffIndex(y);
    let staffPos = this.verDrawableEnd - STAFF_SPACE_HEIGHT -
                      (staffIndex - 1) * STAFF_SPACE_HEIGHT/2;
    return staffPos;
  }

  canvasPos2StaffIndex(y) {
    if (this.isInVerticalBoundaries(y)) {
      if (y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 0.75) {
        return 0;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 1.25) {
        return 1;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 1.75) {
        return 2;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 2.25) {
        return 3;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 2.75) {
        return 4;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 3.25) {
        return 5;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 3.75) {
        return 6;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 4.25) {
        return 7;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 4.75) {
        return 8;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 5.25) {
        return 9;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 5.75) {
        return 10;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 6.25) {
        return 11;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 6.75) {
        return 12;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 7.25) {
        return 13;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 7.75) {
        return 14;
      }
      else if(y > this.verDrawableEnd - STAFF_SPACE_HEIGHT * 8.25) {
        return 15;
      }
    }

    return null;
  }
}
