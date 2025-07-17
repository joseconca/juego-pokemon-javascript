export class EnemyBullet {
  constructor(x, y, w, color = 'black', speed = 5) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 10;
    this.damage = 1;
    this.color = color;
    this.speed = speed;
    this.destroyed = false;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
    this.y += this.speed;
  }
}