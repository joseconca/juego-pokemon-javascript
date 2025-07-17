export class Jugador {
  constructor(x, y, image, canvasWidth) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.health = 2;
    this.destroyed = false;

    this.image = image;
    this.speed = 5;
    this.canvasWidth = canvasWidth;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  move(direction) {
    const rightLimit = this.canvasWidth - this.width / 2 - 30;
    const leftLimit = -this.width / 2 - 20;
    if (direction === 'right' && this.x < rightLimit) this.x += this.speed;
    if (direction === 'left' && this.x > leftLimit) this.x -= this.speed;
  }
}