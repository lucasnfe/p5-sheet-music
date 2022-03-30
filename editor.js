const editorModes = {
    "editing": 0,
    "insertingNote": 1,
    "insertingBar": 2,
    "playing": 3
}

class Editor {
  constructor() {
    this.lastClick = createVector();

    // Set default mode to editing
    this.setMode("editing");
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
      if (note.isSelected) {
        staff.updateNotePosition(note, x, y);
      }
    }
  }

  updateSelectedNotesAccidental(currentAccidental, staff) {
    for (let note of staff.notes) {
      if (note.isSelected) {
        note.accidental = currentAccidental;
      }
    }
  }

  deleteSelectedNotes(staff) {
    for (let note of staff.notes) {
      if (note.isSelected) {
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
    }
  }

  setMode(mode) {
    if (mode in editorModes) {
      // deselect all notes
      for (let note of staff.notes) {
        note.deselect();
      }

      this.mode = mode;
    }
  }
}
