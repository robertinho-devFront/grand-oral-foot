import { BANK } from "../data/questions.js";
import { QUESTIONS_PER_LEVEL } from "../config.js";
import { loadProfile, markSeen } from "./profile.js";

// Trois modes. Chaque mode fixe la difficulté (0 à 3) des 4 manches de 10 questions.
export const MODES = {
  classique: { key: "classique", name: "Classique", rounds: [0, 1, 2, 3], blurb: "Des classiques jusqu'aux légendes." },
  confirme: { key: "confirme", name: "Confirmé", rounds: [1, 2, 2, 3], blurb: "On saute la tribune, on attaque au vestiaire." },
  expert: { key: "expert", name: "Expert", rounds: [2, 2, 3, 3], blurb: "Uniquement des questions de consultants et d'archivistes." },
};
export const MODE_KEYS = Object.keys(MODES);

// Mode conseillé selon les records du joueur.
export function recommendedMode(profile = loadProfile()) {
  const best = Math.max(-1, ...Object.entries(profile.best).map(([m, s]) => (m === "classique" ? s : s + 4)));
  if (best >= 36) return "expert";
  if (best >= 28) return "confirme";
  return "classique";
}

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

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

// Ordre de préférence : d'abord les questions jamais vues (au hasard),
// puis les questions vues il y a le plus longtemps.
function orderedPool(level, seen, exclude) {
  const pool = BANK.filter((q) => q.level === level && !exclude.has(q.id));
  const unseen = shuffle(pool.filter((q) => !seen[q.id]));
  const old = shuffle(pool.filter((q) => seen[q.id])).sort((a, b) => seen[a.id] - seen[b.id]);
  return unseen.concat(old);
}

// Choisit n questions en variant catégories, continents et bonnes réponses.
function pick(pool, n, usedAnswers) {
  const out = [];
  const cat = {};
  const reg = {};
  const capCat = Math.ceil(n / 4);
  const capReg = Math.ceil(n / 2);
  const take = (q) => {
    out.push(q);
    cat[q.cat] = (cat[q.cat] || 0) + 1;
    reg[q.region] = (reg[q.region] || 0) + 1;
    usedAnswers.add(norm(q.o[0]));
  };
  // 1er passage : contraintes de variété. 2e passage : on complète dans l'ordre de préférence.
  for (const q of pool) {
    if (out.length >= n) break;
    if ((cat[q.cat] || 0) >= capCat || (reg[q.region] || 0) >= capReg || usedAnswers.has(norm(q.o[0]))) continue;
    take(q);
  }
  for (const q of pool) {
    if (out.length >= n) break;
    if (!out.includes(q)) take(q);
  }
  return shuffle(out);
}

// Tire une partie complète de 40 questions pour le mode donné et marque les questions comme vues.
export function drawSession(modeKey = "classique") {
  const mode = MODES[modeKey] || MODES.classique;
  const { seen } = loadProfile();
  const picked = new Set();
  const usedAnswers = new Set();
  const session = [];
  mode.rounds.forEach((level) => {
    const qs = pick(orderedPool(level, seen, picked), QUESTIONS_PER_LEVEL, usedAnswers);
    qs.forEach((q) => picked.add(q.id));
    session.push(...qs.map(shuffleChoices));
  });
  markSeen(session.map((q) => q.id));
  return session;
}
