
class Config {
  static margin = 40;
  static width = 1200;

  // -----------
  // Menu
  // -----------
  static menu = {
    x: Config.margin,
    y: Config.margin,
    width: Config.width,
    height: 100,
    defaultNoteValue: "4n",
    button: { width: 60, height: 60 }
  };

  // -----------
  // Staff
  // -----------
  static staff = {
    x: Config.margin,
    y: Config.menu.y + Config.menu.height + 40,
    width: Config.width,
    clef: {
      type: "treble",
      size: 54,
      offset: {x: 25, y: 44}
    },
    timeSignature: {
      type: "4/4",
      size: 50,
      offset: {x: 0, y: 52}
    },
    noteSize: 56,
    nlines: 5,
    spaceHeight: 14,
    scale: [59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]
  };

  // -----------
  // Piano
  // -----------
  static defaultVelocity = 0.9;
}
