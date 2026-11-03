"use client";

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  public bgmPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPop(pitchOffset = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";

    const baseFreq = 520 + pitchOffset * 35;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }

  public playStamp() {
    const ctx = this.getContext();
    if (!ctx) return;

    // Low thump + cute chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);

    // Sparkle overtone
    setTimeout(() => this.playChime([659.25, 880]), 80);
  }

  public playChime(notes: number[] = [523.25, 659.25, 783.99, 1046.5]) {
    const ctx = this.getContext();
    if (!ctx) return;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const startTime = ctx.currentTime + idx * 0.075;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  public playFanfare() {
    this.playChime([523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]);
  }

  public playTick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;
    this.bgmPlaying = true;

    // Cute music box melody (Twinkle / Romantic Lullaby style in C major)
    const melody = [
      523.25, 659.25, 783.99, 1046.5, 987.77, 783.99,
      698.46, 880.0, 783.99, 659.25, 587.33, 783.99,
      523.25, 659.25, 783.99, 1046.5, 880.0, 1046.5,
      987.77, 783.99, 880.0, 987.77, 1046.5, 0,
    ];
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.enabled) return;
      const c = this.getContext();
      if (!c) return;
      const freq = melody[step % melody.length];
      step++;
      if (freq > 0) {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, c.currentTime);
        gain.gain.setValueAtTime(0.045, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0008, c.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.55);
      }
    };

    playNextNote();
    this.bgmInterval = setInterval(playNextNote, 420);
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundManager();
