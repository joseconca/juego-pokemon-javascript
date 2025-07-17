export class Bala {
  constructor(x, y, w, color) {
    this.x = x + 30;
    this.y = y;
    this.w = w;
    this.height = 30;
    this.damage = 1;
    this.destroyed = false;
    this.speed = 10;
    this.color = color;

  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.height);
    ctx.restore();
    this.y -= this.speed;
  }
}
