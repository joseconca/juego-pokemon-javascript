export class Enemigo {
  constructor(x, y, image, canvasWidth) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 50;
    this.image = image;
    this.speed = 2;
    this.health = 2;
    this.destroyed = false;
    this.scoreValue = 3;
    this.scoreHitValue = 1;
    this.limiteIzquierdo = 0;
    this.limiteDerecho = canvasWidth;
  }
  draw(ctx) {
    this.x += this.speed;
    if (this.x + this.width >= this.limiteDerecho || this.x <= this.limiteIzquierdo) {
      this.speed = -this.speed;
      if (this.x + this.width > this.limiteDerecho) this.x = this.limiteDerecho - this.width;
      if (this.x < this.limiteIzquierdo) this.x = this.limiteIzquierdo;
      const rand = Math.floor(Math.random() * 5) - 2;
      if (rand === 0) return;
      this.speed += rand;
      if (Math.abs(this.speed) < 2) this.dx = 2;
      if (Math.abs(this.speed) > 5) this.dx = 5;
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}