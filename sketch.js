
function preload(){
  bravuraFont = loadFont('fonts/Bravura.otf');
  playIcon = loadImage('imgs/play.png');
}

function setup() {
  textFont(bravuraFont);
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Create Menu
  menu = new Menu(Config.menu);

  // Create staff
  staff = new Staff(Config.staff);

  // Create piano
  piano = new Piano("samples/salamander/");

  // Create editor
  editor = new Editor(staff);

  // Compute main width from canvas width
  windowResized();

  playButton = menu.createImgButton(playIcon, 1, play);
  playButton.disable();

  noteSelector = menu.createSelector(6);
  noteSelector.buttons[0] = menu.createSymbolButton('', 3, setCurrentNote1n, releaseCurrentNote);
  noteSelector.buttons[1] = menu.createSymbolButton('', 4, setCurrentNote2n, releaseCurrentNote);
  noteSelector.buttons[2] = menu.createSymbolButton('', 5, setCurrentNote4n, releaseCurrentNote);
  noteSelector.buttons[3] = menu.createSymbolButton('', 6, setCurrentNote8n, releaseCurrentNote);
  noteSelector.buttons[4] = menu.createSymbolButton('', 7, setCurrentNote16n, releaseCurrentNote);
  noteSelector.buttons[5] = menu.createSymbolButton('', 8, setCurrentNote32n, releaseCurrentNote);

  accidentalSelector = menu.createSelector(2);
  accidentalSelector.buttons[0] = menu.createSymbolButton('', 9, toggleSharp, releaseCurrentAccidental);
  accidentalSelector.buttons[1] = menu.createSymbolButton('', 10, toggleFlat, releaseCurrentAccidental);

  barButton = menu.createSymbolButton('', 11, setBar, releaseCurrentNote);
}

function draw() {
  clear();

  menu.draw(bravuraFont);
  staff.draw(bravuraFont);
  editor.draw(menu.currentNoteValue, menu.currentAccidental, bravuraFont, Config.staff.noteSize);
}

function mousePressed() {
  switch (editor.state) {
    case "editing":
      editor.clicked(mouseX, mouseY, bravuraFont);
      break;
    case "insertingNote":
      let addedNote = staff.addNote(mouseX, mouseY, Config.staff.noteSize, menu.currentNoteValue, menu.currentAccidental);
      if (addedNote) {
        playButton.enable();
      }
      break;
    case "insertingBar":
      staff.addBar(mouseX, mouseY);
      break;
  }

  menu.mousePressed(mouseX, mouseY);
}

function mouseDragged() {
  switch (editor.state) {
    case "editing":
      editor.updateSelectedNotesPosition(mouseX, mouseY);
      break;
    case "insertingNote":
      break;
    case "insertingBar":
      break;
  }
}

function mouseReleased() {
  switch (editor.state) {
    case "editing":
      staff.sortNotes();
      break;
    case "insertingNote":
      break;
    case "insertingBar":
      break;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 8: // delete
      editor.deleteSelectedNotes();
      if (staff.notes.length == 0) {
        playButton.disable();
      }
      break;
    case 27: // esc
      stop();
      break;
    case 49: // 1
      noteSelector.buttons[0].pressed();
      break;
    case 50: // 2
      noteSelector.buttons[1].pressed();
      break;
    case 51: // 3
      noteSelector.buttons[2].pressed();
      break;
    case 52: // 4
      noteSelector.buttons[3].pressed();
      break;
    case 53: // 5
      noteSelector.buttons[4].pressed();
      break;
    case 54: // 6
      noteSelector.buttons[5].pressed();
      break;
    case 66: // b
      setBar();
      break;
    case 70: // f
      accidentalSelector.buttons[1].pressed();
      break;
    case 83: // s
      accidentalSelector.buttons[0].pressed();
      break;
  }
}

// -----------
// Callbacks
// -----------
function stop() {
  piano.stop(staff.notes);
  playButton.setState("released");
  editor.setState("editing");
  menu.enable();
}

function play() {
  editor.setState("playing");

  noteSelector.releaseAll();
  accidentalSelector.releaseAll();

  menu.setCurrentNoteValue(null);
  menu.toggleCurrentAccidental(null);
  
  menu.disable();
  piano.play(staff.notes, Config.defaultVelocity, stop);
}

function setCurrentNote1n() {
  barButton.release();
  menu.setCurrentNoteValue("1n");
  editor.setState("insertingNote");
}

function setCurrentNote2n() {
  barButton.release();
  menu.setCurrentNoteValue("2n");
  editor.setState("insertingNote");
}

function setCurrentNote4n() {
  barButton.release();
  menu.setCurrentNoteValue("4n");
  editor.setState("insertingNote");
}

function setCurrentNote8n() {
  barButton.release();
  menu.setCurrentNoteValue("8n");
  editor.setState("insertingNote");
}

function setCurrentNote16n() {
  barButton.release();
  menu.setCurrentNoteValue("16n");
  editor.setState("insertingNote");
}

function setCurrentNote32n() {
  barButton.release();
  menu.setCurrentNoteValue("32n");
  editor.setState("insertingNote");
}

function releaseCurrentNote() {
  editor.setState("editing");
  menu.setCurrentNoteValue(null);
}

function toggleSharp() {
  barButton.release();
  editor.setState("insertingNote");
  menu.toggleCurrentAccidental("#");
  editor.updateSelectedNotesAccidental(menu.currentAccidental);
}

function toggleFlat() {
  barButton.release();
  editor.setState("insertingNote");
  menu.toggleCurrentAccidental("b");
  editor.updateSelectedNotesAccidental(menu.currentAccidental);
}

function releaseCurrentAccidental() {
  menu.toggleCurrentAccidental(null);
}

function setBar() {
  noteSelector.releaseAll();
  accidentalSelector.releaseAll();
  editor.setState("insertingBar");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Compute main width from canvas width
  if (width > Config.staff.x + Config.staff.width) {
    staff.x = width/2 - Config.staff.width/2;
    menu.x = width/2 - Config.menu.width/2;
  }
  else {
    // Compute main width from canvas width
    staff.width = width - Config.margin - Config.staff.x;
    menu.width = width - Config.margin - Config.staff.x;
  }

  staff.updateBoundaries();
}
