export class Boss {
  constructor(x, y, image, canvasWidth) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 150;
    this.image = image;
    this.speed = 1;
    this.maxHealth = 20;
    this.health = this.maxHealth;
    this.destroyed = false;
    this.scoreValue = 25;
    this.scoreHitValue = 1;
    this.limiteIzquierdo = 0;
    this.limiteDerecho = canvasWidth;
  }
  draw(ctx) {
    this.x += this.speed;
    if (this.x + this.width > this.limiteDerecho || this.x < this.limiteIzquierdo) {
      this.speed = -this.speed;
      if (this.x + this.width > this.limiteDerecho) this.x = this.limiteDerecho - this.width;
      if (this.x < this.limiteIzquierdo) this.x = this.limiteIzquierdo;
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    // Barra de vida
    const barW = 150;
    const barH = 10;
    const healthRatio = this.health / this.maxHealth;
    const w = healthRatio * barW;
    ctx.save();

    ctx.fillStyle = 'red'; ctx.fillRect(this.x + (this.width-barW)/2, this.y - 20, barW, barH);
    ctx.fillStyle = 'green'; ctx.fillRect(this.x + (this.width-barW)/2, this.y - 20, w, barH);
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    ctx.strokeRect(this.x + (this.width-barW)/2, this.y - 20, barW, barH);
    ctx.restore();
  }
}