const editorStates = {
    "editing": 0,
    "insertingNote": 1,
    "insertingBar": 2,
    "playing": 3
}

class Editor {
  constructor() {
    this.lastClick = createVector();
    this.deltaClick = createVector();

    // Set default mode to editing
    this.setState("editing");
  }

  draw(staff, currentNoteValue, currentAccidental) {
    switch (this.mode) {
      case "editing":
        break;
      case "insertingNote":
        staff.drawNote(mouseX, mouseY, currentNoteValue, currentAccidental);
        break;
      case "insertingBar":
        if (staff.isInStaff(mouseX, mouseY)) {
            staff.drawBar(mouseX);
        }
        break;
    }
  }

  updateSelectedNotesPosition(x, y, staff) {
    for (let note of staff.notes) {
      if (note.isSelected()) {
        staff.updateNotePosition(note, x + this.deltaClick.x, y + this.deltaClick.y);
      }
    }
  }

  updateSelectedNotesAccidental(currentAccidental, staff) {
    for (let note of staff.notes) {
      if (note.isSelected()) {
        note.accidental = currentAccidental;
      }
    }
  }

  deleteSelectedNotes(staff) {
    for (let note of staff.notes) {
      if (note.isSelected()) {
        staff.removeNote(note);
      }
    }
  }

  clicked(x, y, staff, font) {
    this.lastClick.x = x;
    this.lastClick.y = y;

    // deselect all notes
    for (let note of staff.notes) {
      note.deselect();
    }

    let note = staff.getNoteFromPos(x, y, font);
    if (note) {
        note.select();
        this.deltaClick.x = note.x - this.lastClick.x;
        this.deltaClick.y = note.y - this.lastClick.y;
    }
  }

  setState(mode) {
    if (mode in editorStates) {
      // deselect all notes
      for (let note of staff.notes) {
        note.deselect();
      }

      this.mode = mode;
    }
  }
}
