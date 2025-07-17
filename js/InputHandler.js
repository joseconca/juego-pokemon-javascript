export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = {};

    this.game.canvas.addEventListener('click', e => this.handleClick(e));
    this.game.canvas.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: false });
    this.game.canvas.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: false });
    document.addEventListener('keydown', e => this.keys[e.keyCode] = true);
    document.addEventListener('keyup', e => this.keys[e.keyCode] = false);
  }

  handleClick(e) {
    const rect = this.game.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (this.game.state === 'title') {
      this.game.state = 'select';
      this.game.ui.draw();
    } else if (this.game.state === 'select') {
      this.game.selection.options.forEach(ch => {
        if (mx >= ch.x && mx <= ch.x + this.game.selection.size && my >= ch.y && my <= ch.y + this.game.selection.size) {
          this.game.startGame(ch);
        }
      });
    } else if (this.game.state === 'gameover') {
      this.game.resetGame();
    }
  }

  handleTouchStart(e) {
    e.preventDefault();

    const touch = e.changedTouches[0];
    const rect = this.game.canvas.getBoundingClientRect();
    const mx = touch.clientX - rect.left;

    if (this.game.state !== 'playing') {
      const fakeClick = { clientX: touch.clientX, clientY: touch.clientY };
      this.handleClick(fakeClick);
      return;
    }

    if (mx < this.game.canvas.width * 2 / 5) {
      this.keys[37] = true;
    } else if (mx > this.game.canvas.width * 3 / 5) {
      this.keys[39] = true;
    }

    this.keys[32] = true;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.keys[37] = false;
    this.keys[39] = false;
    this.keys[32] = false;
  }
}
