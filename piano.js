class Piano {
  constructor(url) {
    this.sampler = new Tone.Sampler({
        "A0" : "A0.[mp3|ogg]",
        "C1" : "C1.[mp3|ogg]",
        "D#1" : "Ds1.[mp3|ogg]",
        "F#1" : "Fs1.[mp3|ogg]",
        "A1" : "A1.[mp3|ogg]",
        "C2" : "C2.[mp3|ogg]",
        "D#2" : "Ds2.[mp3|ogg]",
        "F#2" : "Fs2.[mp3|ogg]",
        "A2" : "A2.[mp3|ogg]",
        "C3" : "C3.[mp3|ogg]",
        "D#3" : "Ds3.[mp3|ogg]",
        "F#3" : "Fs3.[mp3|ogg]",
        "A3" : "A3.[mp3|ogg]",
        "C4" : "C4.[mp3|ogg]",
        "D#4" : "Ds4.[mp3|ogg]",
        "F#4" : "Fs4.[mp3|ogg]",
        "A4" : "A4.[mp3|ogg]",
        "C5" : "C5.[mp3|ogg]",
        "D#5" : "Ds5.[mp3|ogg]",
        "F#5" : "Fs5.[mp3|ogg]",
        "A5" : "A5.[mp3|ogg]",
        "C6" : "C6.[mp3|ogg]",
        "D#6" : "Ds6.[mp3|ogg]",
        "F#6" : "Fs6.[mp3|ogg]",
        "A6" : "A6.[mp3|ogg]",
        "C7" : "C7.[mp3|ogg]",
        "D#7" : "Ds7.[mp3|ogg]",
        "F#7" : "Fs7.[mp3|ogg]",
        "A7" : "A7.[mp3|ogg]",
        "C8" : "C8.[mp3|ogg]"
    }, {
        "release" : 1,
        "baseUrl" : url
    }).toDestination();
  }

  play(notes, velocity, callback) {
    // Initialize tone.js
    Tone.start();
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();

    // Create phrase with timed notes
    let events = [];
    let noteStartTime = 0.0;

    for(let note of notes) {
      events.push({ note: note, time: noteStartTime, velocity: velocity });
      noteStartTime += Tone.Time(note.value);
    }

    // Get pointer to object sampler to use in the callback below.
    let sampler = this.sampler;

    // Play part
    const part = new Tone.Part(((time, ev) => {
       // Play note event
       let pitch = Tone.Frequency(ev.note.getPitch(), "midi").toNote();
  	   sampler.triggerAttackRelease(pitch, ev.note.value, time, ev.velocity);

       // Highlight note
       ev.note.setState("playing");
       Tone.Transport.scheduleOnce(() => ev.note.setState("idle"), time + Tone.Time(ev.note.value));

       // Call event at the end of the sequence
       if (events.indexOf(ev) == events.length - 1 && callback)
           Tone.Transport.scheduleOnce(callback, time + Tone.Time(ev.note.value));

    }), events).start(Tone.now());
  }
}
