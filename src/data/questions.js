// Banque de questions : assemblée à partir des fichiers de src/data/bank/.
// Pour ajouter des questions, modifie ces fichiers (la bonne réponse en première position),
// puis lance `npm run check`.

import d1 from "./bank/d1-tribune.js";
import d2 from "./bank/d2-vestiaire.js";
import d3 from "./bank/d3-banc.js";
import d4 from "./bank/d4-legende.js";

// Les 4 niveaux de difficulté des questions.
export const DIFFICULTIES = [
  { name: "Tribune", sub: "Les classiques qu'on doit connaître" },
  { name: "Vestiaire", sub: "Les moments qui ont fait l'histoire" },
  { name: "Banc de touche", sub: "Là où les consultants se régalent" },
  { name: "Légende", sub: "Pour les archivistes du ballon rond" },
];
// Les 4 manches d'une partie portent les mêmes noms (la difficulté réelle dépend du mode).
export const LEVELS = DIFFICULTIES;

export const CATEGORIES = {
  H: "Histoire",
  R: "Règles du jeu",
  A: "Le détail qui tue",
  J: "Joueurs & légendes",
  C: "Clubs & stades",
};

export const REGIONS = {
  EU: "Europe",
  SA: "Amérique du Sud",
  AF: "Afrique",
  AS: "Asie-Océanie",
  NA: "Amérique du Nord",
  MO: "Monde",
};

// Identifiant stable calculé à partir du texte de la question (hash FNV-1a).
function hashId(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}

function build(rows, level) {
  return rows.map(([cat, region, q, good, w1, w2, w3, i]) => ({
    id: hashId(q), level, cat, region, regionName: REGIONS[region] || region, q, o: [good, w1, w2, w3], a: 0, i,
  }));
}

export const BANK = [d1, d2, d3, d4].flatMap((rows, level) => build(rows, level));

// Grades du diplôme. Footix = celui qui parle fort mais connaît mal.
export const GRADES = [
  { min: 34, name: "Légende du vestiaire", line: "Vous pourriez animer l'avant-match." },
  { min: 25, name: "Consultant TV", line: "Solide, documenté, crédible en plateau." },
  { min: 15, name: "Titulaire indiscutable", line: "Le fond de jeu est là. Les archives vous attendent." },
  { min: 0, name: "Footix certifié", line: "Le maillot est neuf, la mémoire aussi. On retente ?" },
];
export const gradeFor = (s) => GRADES.find((g) => s >= g.min);
