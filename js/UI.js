export class UI {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    if (this.game.state === 'title') {
      this.drawTitleScreen();
    } else if (this.game.state === 'select') {
      this.drawSelectScreen();
    } else if (this.game.state === 'gameover') {
      this.drawGameOverScreen();
    } else {
      this.drawGameScreen();
    }
  }

  drawTitleScreen() {
    const ctx = this.ctx;
    ctx.drawImage(this.game.images['title'], 0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText('Haz clic para empezar', this.game.canvas.width / 2, this.game.canvas.height / 2 + 50);
    ctx.fillText('Haz clic para empezar', this.game.canvas.width / 2, this.game.canvas.height / 2 + 50);
  }

  drawSelectScreen() {
    const ctx = this.ctx;
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Selecciona tu Pokémon', this.game.canvas.width / 2, this.game.canvas.height * 2 / 5);
    this.game.selection.options.forEach(ch => {
      ctx.drawImage(ch.image, ch.x + 20, ch.y, this.game.selection.size * 0.8, this.game.selection.size * 0.8);
      ctx.fillText(ch.name, ch.x + this.game.selection.size * 0.5, ch.y + this.game.selection.size);
    });
  }

  drawGameOverScreen() {
    const ctx = this.ctx;
    ctx.fillStyle = 'darkred';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Game Over!', this.game.canvas.width / 2, this.game.canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Haz clic para volver al menú', this.game.canvas.width / 2, this.game.canvas.height / 2 + 20);
  }

  drawGameScreen() {
    const ctx = this.ctx;
    this.game.player.draw(ctx);
    this.game.projectiles.forEach(p => p.draw(ctx));
    this.game.enemies.forEach(e => e.draw(ctx));
    this.drawHealthBar();
    this.drawScore();
    this.drawLevel();
    requestAnimationFrame(this.game.loop);
  }

  drawHealthBar() {
    const ctx = this.ctx;
    const barWidth = 150;
    const barHeight = 10;
    const x0 = this.game.canvas.width * 2 / 5, y0 = 10;
    const ratio = this.game.player.health / this.game.player.maxHealth;
    ctx.fillStyle = 'red';
    ctx.fillRect(x0, y0, barWidth, barHeight);
    ctx.fillStyle = 'green';
    ctx.fillRect(x0, y0, barWidth * ratio, barHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x0, y0, barWidth, barHeight);
  }

  drawScore() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeText(`Puntuación: ${this.game.gameState.score}`, 10, 25);
    ctx.fillText(`Puntuación: ${this.game.gameState.score}`, 10, 25);
  }

  drawLevel() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeText(`level: ${this.game.gameState.playerLevel}`, 10, 45);
    ctx.fillText(`level: ${this.game.gameState.playerLevel}`, 10, 45);
  }
}
