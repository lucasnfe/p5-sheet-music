const MARGIN = 40;

const MENU_X = MARGIN;
const MENU_Y = 15;
const MENU_HEIGHT = 60;

const STAFF_X = MARGIN;
const STAFF_Y = MENU_Y + MENU_HEIGHT + MARGIN;
const STAFF_LINES = 5;
const STAFF_BARS = 0;
const STAFF_CLEF = "treble";
const STAFF_TIME_SIGNATURE = "4/4";

function preload(){
  fontRegular = loadFont('fonts/Bravura.otf');
}

function setup() {
  textFont(fontRegular);
  createCanvas(windowWidth, 400);

  // Compute main width from canvas width
  const mainWidth = width - MARGIN - STAFF_X;

  // Create Menu
  menu = new Menu(MENU_X, MENU_Y, mainWidth, MENU_HEIGHT);
  menu.createImgButton('imgs/play.png', 0.75, play);
  menu.createImgButton('imgs/1n.png', 3, setCurrentNote1n);
  menu.createImgButton('imgs/2n.png', 4, setCurrentNote2n);
  menu.createImgButton('imgs/4n.png', 5, setCurrentNote4n);
  menu.createImgButton('imgs/8n.png', 6, setCurrentNote8n);
  menu.createImgButton('imgs/16n.png', 7, setCurrentNote16n);
  menu.createImgButton('imgs/32n.png', 8, setCurrentNote32n);
  menu.createImgButton('imgs/sharp.png', 9, toggleSharp);
  menu.createImgButton('imgs/flat.png', 10, toggleFlat);

  // Create staff
  staff = new Staff(STAFF_X, STAFF_Y, mainWidth,
                    STAFF_LINES, STAFF_BARS, STAFF_CLEF,
                    STAFF_TIME_SIGNATURE);

  // Create piano
  piano = new Piano("./samples/salamander/");
}

function draw() {
  clear();

  menu.draw();
  staff.draw();

  drawNoteGuide();
}

function keyPressed() {
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

function mouseClicked() {
  if (staff.isInStaff(mouseX, mouseY)) {
    staff.addNote(mouseX, mouseY, menu.currentNoteValue, menu.currentAccidental);
  }
}

// -----------
// Callbacks
// -----------
function play() {
  piano.play(staff.notes);
}

function setCurrentNote1n() {
  menu.setCurrentNoteValue("1n");
}

function setCurrentNote2n() {
  menu.setCurrentNoteValue("2n");
}

function setCurrentNote4n() {
  menu.setCurrentNoteValue("4n");
}

function setCurrentNote8n() {
  menu.setCurrentNoteValue("8n");
}

function setCurrentNote16n() {
  menu.setCurrentNoteValue("16n");
}

function setCurrentNote32n() {
  menu.setCurrentNoteValue("32n");
}

function toggleSharp() {
  menu.toggleCurrentAccidental("#");
}

function toggleFlat() {
  menu.toggleCurrentAccidental("b");
}
