//import './firebaseConfig.js';     
//import './Highscores.js';         
import { Game } from './Game.js';

window.onload = () => {
  const canvas = document.getElementById('gameCanvas');
  if (canvas.getContext) {
    new Game(canvas);
  } else alert('Canvas no soportado');
};