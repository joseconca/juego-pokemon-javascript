export class CollisionDetector {
  constructor(game) {
    this.game = game;
  }

  handleCollisions() {
    // Actualizar y colisionar proyectiles
    this.game.projectiles.forEach(proj => {
      if (proj.destroyed) return;
      proj.update();

      if (proj.owner === 'player') {
        this.game.enemies.forEach(en => {
          if (!en.destroyed && proj.x < en.x + en.width && proj.x + proj.w > en.x && proj.y < en.y + en.height && proj.y + proj.h > en.y) {
            en.health -= proj.damage;
            proj.destroyed = true;
            this.game.gameState.score += en.scoreHitValue;
            if (en.health <= 0) {
              en.destroyed = true;
              this.game.gameState.score += en.scoreValue;
              this.game.gameState.enemiesDefeated++;
              if (this.game.gameState.enemiesDefeated % 10 === 0) this.game.config.enemiesPerWave++;
            }
          }
        });
      } else {
        // enemigo -> jugador
        if (proj.y + proj.h > this.game.player.y && proj.x < this.game.player.x + this.game.player.width && proj.x + proj.w > this.game.player.x) {
          this.game.player.health -= proj.damage;
          proj.destroyed = true;
          if (this.game.player.health <= 0) this.game.state = 'gameover';
        }
      }
    });
    // reenviar spawn y colisiones
    this.game.projectiles = this.game.projectiles.filter(p => !p.destroyed && !p.isOutOfBounds(this.game.canvas));
    this.game.enemies = this.game.enemies.filter(e => !e.destroyed);
  }
}
