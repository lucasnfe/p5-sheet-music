
class Staff {
  constructor(staffConfig) {
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

    // Staff boundaries
    this.spaceHeight = staffConfig.spaceHeight;
    this.horDrawableStart = this.x + this.clefOffset.x + this.clefSize + this.timeSignatureOffset.x + this.timeSignatureSize;
    this.horDrawableEnd   = this.x + this.width;
    this.verDrawableStart = this.y - 1.5 * this.spaceHeight;
    this.verDrawableEnd   = this.y + (this.nLines + 1) * this.spaceHeight;

    this.notes = [];
    this.bars = [];
  }

  draw() {
    // Draw clef
    this.drawClef();

    // Draw time signature
    this.drawTimeSignature();

    // Draw lines
    this.drawLines();

    // Draw bars
    for (let bar of this.bars) {
      this.drawBar(bar);
    }

    // Draw Notes
    for (let note of this.notes) {
      this.drawNote(note.x, note.y, note.value, note.accidental);
    }
  }

  drawClef() {
    textAlign(LEFT);
    textSize(this.clefSize);
    switch (this.clef) {
      case "treble":
        text('', this.x + this.clefOffset.x, this.y + this.clefOffset.y);
        break;
    }
  }

  drawTimeSignature() {
    textAlign(LEFT);
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

  drawBar(x) {
    strokeWeight(1.5);
    line(x, this.y, x, this.y + this.spaceHeight * (this.nLines - 1));
  }

  drawNote(x, y, value, accidental) {
    const staffPos = this.quantizeY(y);
    const isUp = this.getStaffIndexFromY(y) < 7;

    switch (value) {
      case "1n":
        WholeNote.draw(x, staffPos, accidental);
        break;
      case "2n":
        HalfNote.draw(x, staffPos, isUp, accidental);
        break;
      case "4n":
        QuarterNote.draw(x, staffPos, isUp, accidental);
        break;
      case "8n":
        EighthNote.draw(x, staffPos, isUp, accidental);
        break;
      case "16n":
        SixteenthNote.draw(x, staffPos, isUp, accidental);
        break;
      case "32n":
        ThirtySecondNote.draw(x, staffPos, isUp, accidental);
        break;
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

    let note = new Note(x, y, staff.getPitchFromY(y), value, accidental);
    this.notes.splice(low, 0, note);
  }

  addBar(x) {
    // Add note sorted by x position
    let low = 0;
    let high = this.notes.length;

    while (low < high) {
      var mid = low + high >>> 1;
      if (this.bars[mid] < x) low = mid + 1;
      else high = mid;
    }

    this.bars.splice(low, 0, x);
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

  quantizeY(y) {
    let staffIndex = staff.getStaffIndexFromY(y);
    let quantizedY = this.verDrawableEnd - this.spaceHeight -
                      (staffIndex - 1) * this.spaceHeight/2;
    return quantizedY;
  }

  getPitchFromY(y) {
    let staffIndex = staff.getStaffIndexFromY(y);
    let pitch = this.scale[staffIndex]
    return pitch;
  }

  getStaffIndexFromY(y) {
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
