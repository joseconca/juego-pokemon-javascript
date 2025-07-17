import { CHARACTERS } from './PocketMonsters.js';
import { Jugador } from './Jugador.js';
import { Enemigo } from './Enemigo.js';
import { Boss } from './Boss.js';
import { Projectile } from './Projectile.js';
import { AssetLoader } from './AssetLoader.js';
import { InputHandler } from './InputHandler.js';
import { UI } from './UI.js';
import { CollisionDetector } from './CollisionDetector.js';
import { GameState } from './GameState.js';

export class Game {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'title';

    this.config = Object.assign({
      initialEnemies: 1,
      enemiesPerWave: 1,
      bossThreshold: 10,
      enemyFireRate: 0.005,
      fr: 0.005,
    }, config);

    this.selection = { options: [], size: 120, gap: 40 };
    this.projectiles = [];
    this.enemies = [];
    this.gameState = new GameState();

    this.assetLoader = new AssetLoader();
    this.inputHandler = new InputHandler(this);
    this.ui = new UI(this);
    this.collisionDetector = new CollisionDetector(this);
    this.keys = this.inputHandler.keys;

    this.assetLoader.loadAssets().then(() => {
      this.images = this.assetLoader.images;
      this.initSelection();
      this.draw();
    });
  }


  initSelection() {
    const { size, gap } = this.selection;
    const totalW = CHARACTERS.length * size + (CHARACTERS.length - 1) * gap;
    let x = (this.canvas.width - totalW) / 2;
    CHARACTERS.forEach(ch => {
      this.selection.options.push({
        name: ch.name,
        image: this.images[ch.name],
        projectile: ch.projectile,
        x,
        y: this.canvas.height/2 - size/2
      });
      x += size + gap;
    });
    this.enemyImg = this.images['enemy'];
    this.bossImg = this.images['boss'];
  }


  startGame(ch) {
    this.state = 'playing';
    this.player = new Jugador(
      this.canvas.width/2 - 75,
      this.canvas.height*4/5,
      this.images[ch.name],
      this.canvas.width
    );
    this.playerProjConfig = {
      color:  ch.projectile.color,
      width:  ch.projectile.width,
      height: ch.projectile.height,
      speed:  ch.projectile.speed
    };
    this.gameState.reset();
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
    this.ui.draw();
  }

  spawnWave() {
    this.enemies = [];
    for (let i=0; i<this.config.enemiesPerWave; i++) {
      const x = Math.random()*(this.canvas.width-60);
      this.enemies.push(new Enemigo(x,50,this.enemyImg,this.canvas.width));
    }
    if(this.gameState.bossSpawned === true) {
      if (this.gameState.playerLevel < 5) {
        this.gameState.playerLevel+=0.2;
      }
      this.player.maxHealth *= this.gameState.playerLevel;
      this.player.health = this.player.maxHealth;
    }
    this.gameState.bossSpawned = false;
  }

  spawnBoss() {
    this.enemies = [new Boss(
      this.canvas.width/2-100, 50,
      this.bossImg, this.canvas.width
    )];
    this.gameState.bossSpawned = true;
  }

  handleSpawning() {
    if (this.enemies.length === 0) {
      if (!this.gameState.bossSpawned && this.gameState.score >= this.config.bossThreshold){
        this.spawnBoss();
      }
      else this.spawnWave();
    }
  }


  update() {
    if (this.state!=='playing') return;
    // entrada jugador
    if (this.keys[39]) this.player.move('right');
    if (this.keys[37]) this.player.move('left');
    // disparo jugador
    if (this.keys[32] && !this.projectiles.some(p=>p.owner==='player')) {
      const p = this.playerProjConfig;
      this.projectiles.push(new Projectile(
        this.player.x+this.player.width/2-p.width/2, this.player.y,
        p.width*this.gameState.playerLevel, p.height*this.gameState.playerLevel,
        p.speed*this.gameState.playerLevel, -1,
        p.color, 
        1, 
        'player'
      ));
      this.keys[32]=false;
    }
    // disparo enemigos
    this.enemies.forEach(en=>{
      if (Math.random()<this.config.enemyFireRate * this.gameState.enrage) {
        var damage = 1;
        var size = 8;
        this.gameState.enrage = 1;
        if (en instanceof Boss){
          damage = 2;
          size = 30;
          if (en.health < en.maxHealth / 3) {
              this.gameState.enrage = 20;
          }
        }
        this.projectiles.push(new Projectile(
          en.x+en.width/2-2, en.y+en.height,
          5,10, size ,1, 'red', damage, 'enemy'
        ));
      }
    });
    this.collisionDetector.handleCollisions();
    this.handleSpawning();
  }

  draw() {
    this.ui.draw();
  }

  loop = ()=>{
    this.update();
    this.draw();
  }
}