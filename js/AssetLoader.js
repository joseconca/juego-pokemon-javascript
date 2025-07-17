import { CHARACTERS } from './PocketMonsters.js';

export class AssetLoader {
  constructor() {
    this.images = {};
  }

  loadAssets() {
    const toLoad = [
      { key: 'title', src: 'resources/pokemon/caratula.png' },
      { key: 'enemy', src: 'resources/pokemon/pidgey.png' },
      { key: 'boss', src: 'resources/pokemon/boss_snorlax.png' }
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
}
