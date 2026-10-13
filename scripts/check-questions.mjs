// Vérifie la banque de questions : npm run check
// Contrôles : format, 4 choix distincts, bonne réponse unique, catégories et régions valides,
// pas de doublon de question, volumes par niveau suffisants pour le tirage.
import { BANK, DIFFICULTIES, CATEGORIES, REGIONS } from "../src/data/questions.js";

const errors = [];
const warn = [];
const seen = new Map();
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

for (const q of BANK) {
  const where = `[${q.id}] ${q.q.slice(0, 60)}`;
  if (!CATEGORIES[q.cat]) errors.push(`${where} : catégorie inconnue « ${q.cat} »`);
  if (!REGIONS[q.region]) errors.push(`${where} : région inconnue « ${q.region} »`);
  if (q.o.length !== 4) errors.push(`${where} : il faut exactement 4 choix`);
  if (new Set(q.o.map(norm)).size !== q.o.length) errors.push(`${where} : deux choix identiques`);
  if (q.o.some((o) => !o || o === "-")) errors.push(`${where} : choix vide`);
  if (!q.i || q.i.length < 10) warn.push(`${where} : anecdote très courte`);
  if (q.q.length > 170) warn.push(`${where} : question longue (${q.q.length} caractères)`);
  const k = norm(q.q);
  if (seen.has(k)) errors.push(`${where} : doublon de ${seen.get(k)}`);
  seen.set(k, q.id);
}

const ids = new Set(BANK.map((q) => q.id));
if (ids.size !== BANK.length) errors.push("Deux questions ont le même identifiant (même texte ?)");

console.log(`\n${BANK.length} questions au total`);
DIFFICULTIES.forEach((d, i) => {
  const items = BANK.filter((q) => q.level === i);
  const byCat = Object.keys(CATEGORIES).map((c) => `${c}:${items.filter((q) => q.cat === c).length}`).join(" ");
  console.log(`  ${i + 1}. ${d.name.padEnd(15)} ${String(items.length).padStart(3)}   ${byCat}`);
  if (items.length < 40) errors.push(`Niveau ${d.name} : seulement ${items.length} questions (40 minimum)`);
});

warn.forEach((w) => console.log("  ⚠ " + w));
if (errors.length) {
  console.error("\n✗ " + errors.length + " erreur(s) :");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("\n✓ Banque de questions valide\n");
