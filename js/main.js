//import './firebaseConfig.js';     
//import './Highscores.js';         
import { Game } from './Game.js';

function resizeCanvas() {
  const canvas = document.getElementById('gameCanvas');
  // Tamaño CSS actual
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  // Solo cambiamos el buffer interno si difiere
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

window.onload = () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas.getContext) {
    return alert('Canvas no soportado');
  }
  // Ajuste inicial y al redimensionar ventana
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Arranca el juego
  new Game(canvas);
};