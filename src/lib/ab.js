// A/B testing léger, sans dépendance.
// Chaque visiteur reçoit une variante stable par expérience (stockée dans le navigateur).
// Forcer une variante pour tester : ajouter ?ab_diploma_gate=B à l'URL.

export const EXPERIMENTS = {
  // A : diplôme flouté, e-mail requis pour le voir. B : diplôme visible, e-mail pour le recevoir.
  diploma_gate: ["A", "B"],
  // Libellé du bouton principal de l'accueil.
  hero_cta: ["A", "B"],
};

export const COPY = {
  hero_cta: { A: "Commencer le quiz", B: "Tester mes connaissances" },
};

function store(key, value) {
  try {
    if (value === undefined) return window.localStorage.getItem(key);
    window.localStorage.setItem(key, value);
  } catch (e) { /* navigation privée : on garde la variante en mémoire */ }
  return value;
}

const memory = {};
export function variant(name) {
  if (memory[name]) return memory[name];
  const arms = EXPERIMENTS[name];
  let v = null;
  try { v = new URLSearchParams(window.location.search).get("ab_" + name); } catch (e) {}
  if (!arms.includes(v)) v = store("ab_" + name);
  if (!arms.includes(v)) v = arms[Math.floor(Math.random() * arms.length)];
  store("ab_" + name, v);
  memory[name] = v;
  return v;
}

export function allVariants() {
  return Object.fromEntries(Object.keys(EXPERIMENTS).map((k) => [k, variant(k)]));
}
