// Subtle gentle acoustic guitar / harp chime ambient generator using Web Audio API
class RomanticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  private notes = [
    293.66, // D4
    369.99, // F#4
    440.0,  // A4
    587.33, // D5
    659.25, // E5
    739.99, // F#5
    880.0,  // A5
  ];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.045, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.isPlaying = true;
      this.scheduleArpeggio();
    } catch {
      this.isPlaying = false;
    }
  }

  private scheduleArpeggio = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chordPattern = [
      [293.66, 440.0, 587.33, 739.99], // D maj
      [246.94, 369.99, 493.88, 739.99], // B min
      [196.00, 293.66, 392.00, 587.33], // G maj
      [220.00, 329.63, 440.00, 659.25], // A maj
    ];

    const randomChord = chordPattern[Math.floor(Math.random() * chordPattern.length)];

    randomChord.forEach((freq, idx) => {
      const delay = idx * 0.45;
      this.playPluck(freq, delay);
    });

    const nextDelay = 3500 + Math.random() * 1500;
    this.timer = window.setTimeout(this.scheduleArpeggio, nextDelay);
  };

  private playPluck(freq: number, delaySec: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime + delaySec;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Gentle warm triangle / sine mix
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm pluck envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // Safe fallback
      }
    }
  }
}

export const romanticSynth = new RomanticAudioSynthesizer();
