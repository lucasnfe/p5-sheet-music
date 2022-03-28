
class Staff {
  constructor(staffConfig, noteConfig) {
    // Copy staff properties
    this.x = staffConfig.x;
    this.y = staffConfig.y;
    this.width = staffConfig.width;
    this.nLines = staffConfig.nlines;
    this.scale = staffConfig.scale;

    this.clef = staffConfig.clef.type;
    this.clefSize = staffConfig.clef.size;
    this.clefOffset = staffConfig.clef.offset;

    this.timeSignature = staffConfig.timeSignature.type;
    this.timeSignatureSize = staffConfig.timeSignature.size;
    this.timeSignatureOffset = staffConfig.timeSignature.offset;

    // Copy note properties
    this.noteSize = noteConfig.size;
    this.noteOffset = noteConfig.offset;
    this.accidentalOffsetX = noteConfig.accidentalOffsetX;

    // Compute staff boundaries
    this.spaceHeight = staffConfig.spaceHeight;
    this.horDrawableStart = this.x + this.clefOffset.x + this.clefSize + this.timeSignatureOffset.x + this.timeSignatureSize;
    this.horDrawableEnd   = this.x + this.width;
    this.verDrawableStart = this.y - 1.5 * this.spaceHeight;
    this.verDrawableEnd   = this.y + (this.nLines + 1) * this.spaceHeight;

    this.notes = [];
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
    textSize(this.clefSize);
    switch (this.clef) {
      case "treble":
        text('', this.x + this.clefOffset.x, this.y + this.clefOffset.y);
        break;
    }
  }

  drawTimeSignature() {
    textSize(this.timeSignatureSize);
    switch (this.timeSignature) {
      case "4/4":
        text('', this.x + this.clefOffset.x + this.clefSize + this.timeSignatureOffset.x,
                  this.y + this.timeSignatureOffset.y);
        break;
    }
  }

  drawLines() {
    for(let i = 0; i < this.nLines; i++) {
      strokeWeight(1.0);
      line(this.x, this.y + this.spaceHeight * i,
           this.x + this.width, this.y + this.spaceHeight * i);
    }
  }

  drawBars() {
    let bar_width = (this.horDrawableEnd - this.horDrawableStart)/this.n_bars;

    for (let i = 0; i < this.n_bars; i++) {
      strokeWeight(1.5);
      line(this.horDrawableStart + bar_width * (i + 1),
           this.y,
           this.horDrawableStart + bar_width * (i + 1),
           this.y + this.spaceHeight * (STAFF_LINES - 1));
    }
  }

  drawNote(x, y, value, accidental) {
    const staffIndex = this.canvasPos2StaffIndex(y);
    const staffPos = this.canvasPos2StaffPos(y);

    let isUpSideDown = staffIndex >= 7;
    const noteChar = Note.getChar(value, isUpSideDown);

    // Draw note
    textSize(this.noteSize);
    text(noteChar, x + this.noteOffset.x, staffPos + this.noteOffset.y);

    // Draw accidental
    switch (accidental) {
      case "#":
        text('', x + this.noteOffset.x - 10, staffPos + this.noteOffset.y);
        break;
      case "b":
        text('', x + this.noteOffset.x - 10, staffPos + this.noteOffset.y);
        break;
    }

    // draw ledger line
    if (staffIndex == 1 || staffIndex == 13) {
      line(x - this.noteSize/4, staffPos, x + this.noteSize/4, staffPos);
    }
  }

  addNote(x, y, value, accidental) {
    // Add note sorted by x position
    let low = 0;
    let high = this.notes.length;

    while (low < high) {
      var mid = low + high >>> 1;
      if (this.notes[mid].x < x) low = mid + 1;
      else high = mid;
    }

    let note = new Note(x, y, staff.canvasPos2Pitch(y), value, accidental);
    this.notes.splice(low, 0, note);
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
    return this.scale[staffIndex];
  }

  canvasPos2StaffPos(y) {
    let staffIndex = staff.canvasPos2StaffIndex(y);
    let staffPos = this.verDrawableEnd - this.spaceHeight -
                      (staffIndex - 1) * this.spaceHeight/2;
    return staffPos;
  }

  canvasPos2StaffIndex(y) {
    if (this.isInVerticalBoundaries(y)) {
      if (y > this.verDrawableEnd - this.spaceHeight * 0.75) {
        return 0;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 1.25) {
        return 1;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 1.75) {
        return 2;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 2.25) {
        return 3;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 2.75) {
        return 4;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 3.25) {
        return 5;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 3.75) {
        return 6;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 4.25) {
        return 7;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 4.75) {
        return 8;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 5.25) {
        return 9;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 5.75) {
        return 10;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 6.25) {
        return 11;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 6.75) {
        return 12;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 7.25) {
        return 13;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 7.75) {
        return 14;
      }
      else if(y > this.verDrawableEnd - this.spaceHeight * 8.25) {
        return 15;
      }
    }

    return null;
  }
}
