
const editorModes = {
    "editing": 0,
    "insertingNote": 1,
    "insertingBar": 2,
}

function preload(){
  fontRegular = loadFont('fonts/Bravura.otf');
}

function setup() {
  textFont(fontRegular);
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

  // Create piano
  piano = new Piano("samples/salamander/");

  editorMode = editorModes["insertingNote"];
}

function draw() {
  clear();

  menu.draw();
  staff.draw();

  switch (editorMode) {
    case editorModes["editing"]:
      break;
    case editorModes["insertingNote"]:
      drawNoteGuide();
      break;
    case editorModes["insertingBar"]:
      drawBarGuide();
      break;
  }
}

function keyPressed() {
  console.log(keyCode);
  switch (keyCode) {
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

function drawNoteGuide() {
  if (staff.isInStaff(mouseX, mouseY)) {
    staff.drawNote(mouseX, mouseY, menu.currentNoteValue, menu.currentAccidental);
  }
}

function drawBarGuide() {
  if (staff.isInStaff(mouseX, mouseY)) {
    staff.drawBar(mouseX, mouseY);
  }
}

function mouseClicked() {
  if (staff.isInStaff(mouseX, mouseY)) {
    switch (editorMode) {
      case editorModes["editing"]:
        break;
      case editorModes["insertingNote"]:
        staff.addNote(mouseX, mouseY, menu.currentNoteValue, menu.currentAccidental);
        break;
      case editorModes["insertingBar"]:
        staff.addBar(mouseX);
        break;
    }
  }
}

// -----------
// Callbacks
// -----------
function play() {
  piano.play(staff.notes, Config.defaultVelocity);
}

function setCurrentNote1n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("1n");
}

function setCurrentNote2n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("2n");
}

function setCurrentNote4n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("4n");
}

function setCurrentNote8n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("8n");
}

function setCurrentNote16n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("16n");
}

function setCurrentNote32n() {
  editorMode = editorModes["insertingNote"];
  menu.setCurrentNoteValue("32n");
}

function toggleSharp() {
  menu.toggleCurrentAccidental("#");
}

function toggleFlat() {
  menu.toggleCurrentAccidental("b");
}

function setBar() {
  editorMode = editorModes["insertingBar"];
}
