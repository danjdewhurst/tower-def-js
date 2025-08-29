export class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new AudioContext();
    } catch (_e) {
      console.warn("Web Audio API not supported");
      this.enabled = false;
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = "sine"): void {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playShoot(): void {
    this.createTone(800, 0.1, "square");
  }

  playEnemyHit(): void {
    this.createTone(300, 0.15, "sawtooth");
  }

  playEnemyDeath(): void {
    this.createTone(150, 0.3, "triangle");
  }

  playTowerPlace(): void {
    this.createTone(600, 0.2, "sine");
  }

  playWaveStart(): void {
    this.createTone(400, 0.5, "triangle");
  }

  playVictory(): void {
    setTimeout(() => this.createTone(523, 0.2), 0); // C
    setTimeout(() => this.createTone(659, 0.2), 200); // E
    setTimeout(() => this.createTone(784, 0.4), 400); // G
  }

  playDefeat(): void {
    setTimeout(() => this.createTone(400, 0.3), 0);
    setTimeout(() => this.createTone(350, 0.3), 150);
    setTimeout(() => this.createTone(300, 0.5), 300);
  }

  async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }
}
