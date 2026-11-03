"use client";

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  public bgmPlaying: boolean = false;
  private unlockBound: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initAutoplayBgm(onStateChange?: (playing: boolean) => void) {
    if (typeof window === "undefined") return;
    this.startBgm();
    onStateChange?.(true);

    if (!this.unlockBound) {
      this.unlockBound = true;
      const unlockAudio = () => {
        if (!this.enabled) return;
        const c = this.getContext();
        if (c && c.state === "suspended") {
          c.resume().catch(() => {});
        }
        if (!this.bgmPlaying && this.enabled) {
          this.startBgm();
          onStateChange?.(true);
        }
        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };

      window.addEventListener("pointerdown", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
    }
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

    // Romantic Music Box Melody + Warm Harmony Bass Note
    const melody: Array<[number, number]> = [
      [523.25, 261.63],
      [659.25, 0],
      [783.99, 392.0],
      [1046.5, 0],
      [987.77, 329.63],
      [783.99, 0],
      [698.46, 349.23],
      [880.0, 0],
      [783.99, 392.0],
      [659.25, 0],
      [587.33, 293.66],
      [783.99, 0],
      [523.25, 261.63],
      [659.25, 0],
      [783.99, 392.0],
      [1046.5, 0],
      [880.0, 349.23],
      [1046.5, 0],
      [987.77, 392.0],
      [783.99, 0],
      [880.0, 329.63],
      [987.77, 392.0],
      [1046.5, 523.25],
      [0, 0],
    ];
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.enabled) return;
      const c = this.getContext();
      if (!c) return;
      const [mainFreq, bassFreq] = melody[step % melody.length];
      step++;

      if (mainFreq > 0) {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(mainFreq, c.currentTime);
        gain.gain.setValueAtTime(0.055, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0008, c.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.65);
      }

      if (bassFreq > 0) {
        const bOsc = c.createOscillator();
        const bGain = c.createGain();
        bOsc.type = "triangle";
        bOsc.frequency.setValueAtTime(bassFreq, c.currentTime);
        bGain.gain.setValueAtTime(0.03, c.currentTime);
        bGain.gain.exponentialRampToValueAtTime(0.0008, c.currentTime + 0.75);
        bOsc.connect(bGain);
        bGain.connect(c.destination);
        bOsc.start();
        bOsc.stop(c.currentTime + 0.75);
      }
    };

    playNextNote();
    this.bgmInterval = setInterval(playNextNote, 410);
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
