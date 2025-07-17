import { CHARACTERS } from './PocketMonsters.js';
import { Jugador } from './Jugador.js';
import { Enemigo } from './Enemigo.js';
import { Boss } from './Boss.js';
import { Projectile } from './Projectile.js';

export class Game {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'title';

    this.config = Object.assign({
      initialEnemies: 1,
      enemiesPerWave: 1,
      bossThreshold: 100,
      enemyFireRate: 0.005
    }, config);

    this.selection = { options: [], size: 120, gap: 40 };
    this.keys = {};
    this.projectiles = [];
    this.enemies = [];
    this.score = 0;
    this.enemiesDefeated = 0;
    this.bossSpawned = false;

    this.images = {};
    this.loadAssets().then(() => {
      this.initSelection();
      this.draw();
    });

    this.addListeners();
  }

  loadAssets() {
    const toLoad = [
      { key: 'title', src: 'images/caratula.png' },
      { key: 'enemy', src: 'images/pidgey.png' },
      { key: 'boss', src: 'images/boss_snorlax.png' }
    ].concat(
      CHARACTERS.map(ch => ({ key: ch.name, src: ch.img }))
    );
    return Promise.all(toLoad.map(item => {
      const img = new Image();
      img.src = item.src;
      this.images[item.key] = img;
      return new Promise(res => img.onload = res);
    }));
  }

  initSelection() {
    const { size, gap } = this.selection;
    const totalW = CHARACTERS.length * size + (CHARACTERS.length - 1) * gap;
    let x = (this.canvas.width - totalW) / 2;
    // Generar opciones con propiedad `image` que es un HTMLImageElement
    CHARACTERS.forEach(ch => {
      this.selection.options.push({
        name: ch.name,
        image: this.images[ch.name], // Imagen ya cargada
        color: ch.color,
        x,
        y: this.canvas.height/2 - size/2
      });
      x += size + gap;
    });
    this.enemyImg = this.images['enemy'];
    this.bossImg = this.images['boss'];
  }

  addListeners() {
    this.canvas.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('keydown', e => this.keys[e.keyCode] = true);
    document.addEventListener('keyup', e => this.keys[e.keyCode] = false);
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (this.state === 'title') {
      this.state = 'select';
      this.draw();
    } else if (this.state === 'select') {
      this.selection.options.forEach(ch => {
        if (mx >= ch.x && mx <= ch.x + this.selection.size && my >= ch.y && my <= ch.y + this.selection.size) {
          this.startGame(ch);
        }
      });
    } else if (this.state === 'gameover') {
      this.resetGame();
    }
  }

  startGame(ch) {
    this.state = 'playing';
    this.player = new Jugador(
      this.canvas.width/2 - 75,
      400,
      this.images[ch.name],
      this.canvas.width
    );
    this.bulletColor = ch.color;
    this.score = 0;
    this.enemiesDefeated = 0;
    this.config.enemiesPerWave = this.config.initialEnemies;
    this.spawnWave();
    document.getElementById('gameTitle').textContent = `¡Adelante, ${ch.name}!`;
    requestAnimationFrame(this.loop);
  }

  resetGame() {
    this.state = 'title';
    document.getElementById('gameTitle').textContent = '¡Corre, Pikachu, Corre!';
    this.projectiles = [];
    this.enemies = [];
    this.draw();
  }

  spawnWave() {
    this.enemies = [];
    for (let i=0; i<this.config.enemiesPerWave; i++) {
      const x = Math.random()*(this.canvas.width-60);
      this.enemies.push(new Enemigo(x,50,this.enemyImg,this.canvas.width));
    }
    this.bossSpawned = false;
  }

  spawnBoss() {
    this.enemies = [new Boss(
      this.canvas.width/2-100, 50,
      this.bossImg, this.canvas.width
    )];
    this.bossSpawned = true;
  }

  handleSpawning() {
    if (this.enemies.length === 0) {
      if (!this.bossSpawned && this.score >= this.config.bossThreshold) this.spawnBoss();
      else this.spawnWave();
    }
  }

  handleCollisions() {
    // Actualizar y colisionar proyectiles
    this.projectiles.forEach(proj => {
      if (proj.destroyed) return;
      proj.update();

      if (proj.owner === 'player') {
        this.enemies.forEach(en => {
          if (!en.destroyed && proj.x < en.x+en.width && proj.x+proj.w>en.x && proj.y<en.y+en.height && proj.y+proj.h>en.y) {
            en.health -= proj.damage;
            proj.destroyed = true;
            this.score += en.scoreHitValue;
            if (en.health<=0) {
              en.destroyed=true;
              this.score+=en.scoreValue;
              this.enemiesDefeated++;
              if (this.enemiesDefeated%10===0) this.config.enemiesPerWave++;
            }
          }
        });
      } else {
        // enemigo -> jugador
        if (proj.y+proj.h>this.player.y && proj.x < this.player.x+this.player.width && proj.x+proj.w>this.player.x) {
          this.player.health -= proj.damage;
          proj.destroyed=true;
          if (this.player.health<=0) this.state='gameover';
        }
      }
    });
    // reenviar spawn y colisiones
    this.projectiles = this.projectiles.filter(p=>!p.destroyed && !p.isOutOfBounds(this.canvas));
    this.enemies = this.enemies.filter(e=>!e.destroyed);
  }

  update() {
    if (this.state!=='playing') return;
    // entrada jugador
    if (this.keys[39]) this.player.move('right');
    if (this.keys[37]) this.player.move('left');
    // disparo jugador
    if (this.keys[32] && !this.projectiles.some(p=>p.owner==='player')) {
      this.projectiles.push(new Projectile(
        this.player.x+this.player.width/2-2.5, this.player.y,
        5,15, 15,-1, this.bulletColor, 1, 'player'
      ));
      this.keys[32]=false;
    }
    // disparo enemigos
    this.enemies.forEach(en=>{
      if (Math.random()<this.config.enemyFireRate) {
        this.projectiles.push(new Projectile(
          en.x+en.width/2-2, en.y+en.height,
          5,10, 8,1, 'red', 1, 'enemy'
        ));
      }
    });
    this.handleCollisions();
    this.handleSpawning();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    if (this.state==='title') {
      ctx.drawImage(this.images['title'],0,0,this.canvas.width,this.canvas.height);
      ctx.fillStyle='white';ctx.font='40px Arial';ctx.textAlign='center';ctx.strokeStyle='black';ctx.lineWidth=4;
      ctx.strokeText('Haz clic para empezar',this.canvas.width/2,this.canvas.height/2+50);
      ctx.fillText('Haz clic para empezar',this.canvas.width/2,this.canvas.height/2+50);
    } else if(this.state==='select') {
      // Fondo para pantalla de selección
      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle='white';ctx.font='30px Arial';ctx.textAlign='center';
      ctx.fillText('Selecciona tu Pokémon',this.canvas.width/2,80);
      this.selection.options.forEach(ch=>{
        ctx.drawImage(ch.image,ch.x,ch.y,this.selection.size,this.selection.size);
        ctx.fillText(ch.name,ch.x+this.selection.size/2,ch.y+this.selection.size+30);
      });
    } else if(this.state==='gameover') {
      ctx.fillStyle='darkred';ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      ctx.fillStyle='white';ctx.font='50px Arial';ctx.textAlign='center';
      ctx.fillText('¡Game Over!',this.canvas.width/2,this.canvas.height/2-20);
      ctx.font='20px Arial';ctx.fillText('Haz clic para volver al menú',this.canvas.width/2,this.canvas.height/2+20);
    } else {
      this.player.draw(ctx);
      this.projectiles.forEach(p=>p.draw(ctx));
      this.enemies.forEach(e=>e.draw(ctx));
      ctx.fillStyle='white';ctx.font='20px Arial';ctx.textAlign='left';ctx.strokeStyle='black';ctx.lineWidth=1;
      ctx.strokeText(`Puntuación: ${this.score}`,10,25);
      ctx.fillText(`Puntuación: ${this.score}`,10,25);
      requestAnimationFrame(this.loop);
    }
  }

  loop = ()=>{
    this.update();
    this.draw();
  }
}