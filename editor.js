const editorStates = {
    "editing": 0,
    "insertingNote": 1,
    "insertingBar": 2,
    "playing": 3
}

class Editor {
  constructor(staff) {
    this.staff = staff;

    this.lastClick = createVector();
    this.deltaClick = createVector();

    // Set default mode to editing
    this.setState("editing");
  }

  draw(value, accidental, font, size) {
    switch (this.state) {
      case "editing":
        break;
      case "insertingNote":
        if (value) {
          this.staff.drawNote(mouseX, mouseY, font, size, value, accidental);
        }
        break;
      case "insertingBar":
        if (this.staff.isInStaff(mouseX, mouseY)) {
          this.staff.drawBar(mouseX);
        }
        break;
    }
  }

  updateSelectedNotesPosition(x, y) {
    for (let note of this.staff.notes) {
      if (note.isSelected()) {
        this.staff.updateNotePosition(note, x + this.deltaClick.x, y + this.deltaClick.y);
      }
    }
  }

  updateSelectedNotesAccidental(currentAccidental) {
    for (let note of this.staff.notes) {
      if (note.isSelected()) {
        note.accidental = currentAccidental;
      }
    }
  }

  deleteSelectedNotes() {
    for (let note of this.staff.notes) {
      if (note.isSelected()) {
        this.staff.removeNote(note);
      }
    }
  }

  clicked(x, y, font) {
    this.lastClick.x = x;
    this.lastClick.y = y;

    // deselect all notes
    for (let note of this.staff.notes) {
      note.deselect();
    }

    let note = this.staff.getNoteFromPos(x, y, font);
    if (note) {
        note.select();
        this.deltaClick.x = note.x - this.lastClick.x;
        this.deltaClick.y = note.y - this.lastClick.y;
    }
  }

  setState(state) {
    if (state in editorStates) {
      // deselect all notes
      for (let note of this.staff.notes) {
        note.deselect();
      }

      this.state = state;
    }
  }
}
