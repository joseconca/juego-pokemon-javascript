export class GameState {
  constructor() {
    this.score = 0;
    this.enemiesDefeated = 0;
    this.bossSpawned = false;
    this.enrage = 1; // factor de enrage para el boss
    this.playerLevel = 1;
  }

  reset() {
    this.score = 0;
    this.enemiesDefeated = 0;
    this.bossSpawned = false;
    this.enrage = 1;
    this.playerLevel = 1;
  }
}
