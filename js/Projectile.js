export class Projectile {
  constructor(x, y, w, h, speed, direction, color, damage, owner) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.direction = direction; // -1 arriba, +1 abajo
    this.color = color;
    this.damage = damage;
    this.owner = owner; // 'player' o 'enemy'
    this.destroyed = false;
  }

  update() {
    this.y += this.speed * this.direction;
  }

  draw(ctx) {
    if (this.destroyed) return;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }

  isOutOfBounds(canvas) {
    return this.y < -this.h || this.y > canvas.height + this.h;
  }
}
