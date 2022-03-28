
class Note {
  constructor(x, y, pitch, value, accidental = null) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
    this.value = value;
    this.accidental = accidental;
  }

  getPitch() {
    let pitch = this.pitch;

    if (this.accidental == "#") {
      pitch += 1;
    }
    else if (this.accidental == "b") {
      pitch -= 1;
    }

    return pitch;
  }

  static getChar(value, upSideDown = false) {
    switch (value) {
      case "1n":
          return '';
      case "2n":
        if (upSideDown) {
          return '';
        }
        else {
          return '';
        }
      case "4n":
        if (upSideDown) {
          return '';
        }
        else {
          return '';
        }
      case "8n":
        if (upSideDown) {
          return '';
        }
        else {
          return '';
        }
      case "16n":
        if (upSideDown) {
          return '';
        }
        else {
          return '';
        }
      case "32n":
        if (upSideDown) {
          return '';
        }
        else {
          return '';
        }
    }

    return null;
  }
}
