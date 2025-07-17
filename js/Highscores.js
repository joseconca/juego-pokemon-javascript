import { ref, push, query, orderByChild, limitToLast, onValue } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';
import { db } from './firebaseConfig.js';

const HS_NODE = 'highscores';
const MAX_SCORES = 20;

export function saveHighscore(nombre, puntuacion, version) {
  const fecha = new Date().toISOString();
  const newRef = push(ref(db, HS_NODE));
  newRef.set({ nombre, puntuacion, fecha, version });
}

export function loadHighscores(callback) {
  const q = query(ref(db, HS_NODE), orderByChild('puntuacion'), limitToLast(MAX_SCORES));
  onValue(q, snapshot => {
    const data = snapshot.val() || {};
    const list = Object.values(data)
      .sort((a, b) => b.puntuacion - a.puntuacion);
    callback(list);
  });
}