import { BANK, LEVELS } from "../data/questions.js";
import { QUESTIONS_PER_LEVEL } from "../config.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleChoices(item) {
  const order = shuffle(item.o.map((_, i) => i));
  return { ...item, o: order.map((i) => item.o[i]), a: order.indexOf(item.a) };
}

// Tire QUESTIONS_PER_LEVEL questions par niveau en couvrant d'abord un maximum
// de continents différents, puis complète au hasard.
export function drawSession() {
  const out = [];
  LEVELS.forEach((_, level) => {
    const pool = shuffle(BANK.filter((q) => q.level === level));
    const picked = [];
    const seen = new Set();
    for (const q of pool) if (!seen.has(q.region)) { seen.add(q.region); picked.push(q); }
    for (const q of pool) if (picked.length < QUESTIONS_PER_LEVEL && !picked.includes(q)) picked.push(q);
    out.push(...shuffle(picked.slice(0, QUESTIONS_PER_LEVEL)).map(shuffleChoices));
  });
  return out;
}
