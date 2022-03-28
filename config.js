
class Config {
  static margin = 40;
  static width = 400;

  // -----------
  // Menu
  // -----------
  static menu = {
    x: Config.margin,
    y: Config.margin,
    width: Config.width,
    height: 60,
    defaultNoteValue: "4n"
  };

  // -----------
  // Staff
  // -----------
  static staff = {
    x: Config.margin,
    y: Config.margin + Config.menu.y + Config.menu.height,
    width: Config.width,
    clef: {
      type: "treble",
      size: 34,
      offset: {x: 10, y: 32}
    },
    timeSignature: {
      type: "4/4",
      size: 34,
      offset: {x: 0, y: 37}
    },
    nlines: 5,
    spaceHeight: 10,
    scale: [59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]
  };

  // -----------
  // Note
  // -----------
  static note = {
    size: 34,
    offset: {x: -6, y: 0},
    accidentalOffsetX: -10
  };

  // -----------
  // Piano
  // -----------
  static defaultVelocity = 0.9;
}
