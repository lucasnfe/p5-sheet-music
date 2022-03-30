
function preload(){
  bravuraFont = loadFont('fonts/Bravura.otf');
}

function setup() {
  textFont(bravuraFont);
  createCanvas(windowWidth, 400);

  angleMode(DEGREES);

  // Compute main width from canvas width
  const mainWidth = width - Config.margin - Config.staff.x;
  Config.staff.width = mainWidth;
  Config.menu.width = mainWidth;

  // Create Menu
  menu = new Menu(Config.menu);
  menu.createImgButton('imgs/play.png', 0.75, play);
  menu.createImgButton('imgs/1n.png', 3, setCurrentNote1n);
  menu.createImgButton('imgs/2n.png', 4, setCurrentNote2n);
  menu.createImgButton('imgs/4n.png', 5, setCurrentNote4n);
  menu.createImgButton('imgs/8n.png', 6, setCurrentNote8n);
  menu.createImgButton('imgs/16n.png', 7, setCurrentNote16n);
  menu.createImgButton('imgs/32n.png', 8, setCurrentNote32n);
  menu.createImgButton('imgs/sharp.png', 9, toggleSharp);
  menu.createImgButton('imgs/flat.png', 10, toggleFlat);
  menu.createImgButton('imgs/bar.png', 11, setBar);

  // Create staff
  staff = new Staff(Config.staff);

  // Create editor
  editor = new Editor();

  // Create piano
  piano = new Piano("samples/salamander/");
}

function draw() {
  clear();

  menu.draw();
  staff.draw();
  editor.draw(staff, menu.currentNoteValue, menu.currentAccidental);
}

function mousePressed() {
  switch (editor.mode) {
    case "editing":
      editor.clicked(mouseX, mouseY, staff, bravuraFont);
      break;
    case "insertingNote":
      staff.addNote(mouseX, mouseY, menu.currentNoteValue, menu.currentAccidental);
      break;
    case "insertingBar":
      staff.addBar(mouseX, mouseY);
      break;
  }
}

function mouseDragged() {
  switch (editor.mode) {
    case "editing":
      editor.updateSelectedNotesPosition(mouseX, mouseY, staff);
      break;
    case "insertingNote":
      break;
    case "insertingBar":
      break;
  }
}

function mouseReleased() {
  switch (editor.mode) {
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
  console.log(keyCode);
  switch (keyCode) {
    case 8: // delete
      editor.deleteSelectedNotes(staff);
      break;
    case 27: // esc
      editor.setMode("editing");
      break;
    case 49: // 1
      setCurrentNote1n();
      break;
    case 50: // 2
      setCurrentNote2n();
      break;
    case 51: // 3
      setCurrentNote4n();
      break;
    case 52: // 4
      setCurrentNote8n();
      break;
    case 53: // 5
      setCurrentNote16n();
      break;
    case 54: // 6
      setCurrentNote32n();
      break;
    case 66: // b
      setBar();
      break;
    case 70: // f
      toggleFlat();
      break;
    case 83: // s
      toggleSharp();
      break;
  }
}

// -----------
// Callbacks
// -----------
function stop() {
  editor.setMode("editing");
}

function play() {
  editor.setMode("playing");
  piano.play(staff.notes, Config.defaultVelocity, stop);
}

function setCurrentNote1n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("1n");
}

function setCurrentNote2n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("2n");
}

function setCurrentNote4n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("4n");
}

function setCurrentNote8n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("8n");
}

function setCurrentNote16n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("16n");
}

function setCurrentNote32n() {
  editor.setMode("insertingNote");
  menu.setCurrentNoteValue("32n");
}

function toggleSharp() {
  menu.toggleCurrentAccidental("#");
  editor.updateSelectedNotesAccidental(menu.currentAccidental, staff);
}

function toggleFlat() {
  menu.toggleCurrentAccidental("b");
  editor.updateSelectedNotesAccidental(menu.currentAccidental, staff);
}

function setBar() {
  editor.setMode("insertingBar");
}
