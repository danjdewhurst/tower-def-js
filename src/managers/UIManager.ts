import type { IUIManager, UIUpdateData } from "../interfaces/IUIManager";
import { TowerType } from "../types/Game";

export class UIManager implements IUIManager {
  private selectedTowerType: TowerType = TowerType.BASIC;

  constructor() {
    this.setupTowerSelectionButtons();
    this.showCameraControls();
  }

  setupTowerSelectionButtons(): void {
    // Tower selection buttons
    const towerButtons = document.querySelectorAll(".tower-btn");
    towerButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const towerType = target.getAttribute("data-tower") as TowerType;
        this.selectTowerType(towerType);
      });
    });
  }

  selectTowerType(towerType: TowerType): void {
    this.selectedTowerType = towerType;

    // Update button selection visual
    document.querySelectorAll(".tower-btn").forEach((btn) => {
      (btn as HTMLElement).style.borderColor = "#666";
    });

    const selectedBtn = document.querySelector(`[data-tower="${towerType}"]`) as HTMLElement;
    if (selectedBtn) {
      selectedBtn.style.borderColor = "#FFF";
    }
  }

  getSelectedTowerType(): TowerType {
    return this.selectedTowerType;
  }

  updateMoneyDisplay(money: number): void {
    const moneyElement = document.getElementById("money");
    if (moneyElement) {
      moneyElement.textContent = money.toString();
    }
  }

  updateWaveDisplay(currentWave: number, totalWaves: number): void {
    const waveElement = document.getElementById("wave");
    if (waveElement) {
      if (currentWave === 0) {
        waveElement.textContent = "Ready";
      } else {
        waveElement.textContent = `${currentWave}/${totalWaves}`;
      }
    }
  }

  updateLivesDisplay(lives: number): void {
    const livesElement = document.getElementById("lives");
    if (livesElement) {
      livesElement.textContent = lives.toString();
    }
  }

  updateStartWaveButton(currentWave: number, totalWaves: number, waveInProgress: boolean): void {
    const startWaveBtn = document.getElementById("startWaveBtn");
    if (!startWaveBtn) return;

    if (waveInProgress) {
      startWaveBtn.textContent = "Wave in Progress";
      (startWaveBtn as HTMLButtonElement).disabled = true;
      (startWaveBtn as HTMLElement).style.opacity = "0.6";
      (startWaveBtn as HTMLElement).style.cursor = "not-allowed";
    } else if (currentWave >= totalWaves) {
      startWaveBtn.textContent = "All Waves Complete";
      (startWaveBtn as HTMLButtonElement).disabled = true;
      (startWaveBtn as HTMLElement).style.opacity = "0.6";
      (startWaveBtn as HTMLElement).style.cursor = "not-allowed";
    } else {
      const waveNumber = currentWave + 1;
      startWaveBtn.textContent = `Start Wave ${waveNumber}`;
      (startWaveBtn as HTMLButtonElement).disabled = false;
      (startWaveBtn as HTMLElement).style.opacity = "1";
      (startWaveBtn as HTMLElement).style.cursor = "pointer";
    }
  }

  updateAllDisplays(data: UIUpdateData): void {
    this.updateMoneyDisplay(data.money);
    this.updateWaveDisplay(data.wave, data.totalWaves);
    this.updateLivesDisplay(data.lives);
    this.updateStartWaveButton(data.wave, data.totalWaves, data.waveInProgress);
  }

  showCameraControls(): void {
    const cameraControls = document.getElementById("cameraControls");
    if (cameraControls) {
      cameraControls.style.display = "block";
    }
  }

  setupStartWaveButton(onStartWave: () => void): void {
    const startWaveBtn = document.getElementById("startWaveBtn");
    startWaveBtn?.addEventListener("click", onStartWave);
  }

  setupPauseButton(onTogglePause: () => void): void {
    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn?.addEventListener("click", onTogglePause);
  }

  updatePauseButton(isPaused: boolean): void {
    const pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn) {
      pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    }
  }
}
