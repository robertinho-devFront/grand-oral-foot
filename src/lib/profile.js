// Profil du joueur, gardé dans son navigateur : questions déjà vues, records, nombre de parties.
// Sert à ne pas reproposer les mêmes questions et à adapter la difficulté.

const KEY = "gof_profile_v1";
const MAX_SEEN = 2000;

const empty = () => ({ seen: {}, best: {}, plays: 0, last: null });
let memory = null; // repli si le stockage est bloqué (navigation privée, etc.)

export function loadProfile() {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch (e) {
    memory = empty();
  }
  return memory;
}

function save(p) {
  memory = p;
  try {
    // On garde les plus récentes si la liste devient trop longue.
    const entries = Object.entries(p.seen);
    if (entries.length > MAX_SEEN) {
      entries.sort((a, b) => b[1] - a[1]);
      p.seen = Object.fromEntries(entries.slice(0, MAX_SEEN));
    }
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch (e) { /* stockage indisponible : le profil reste en mémoire */ }
}

export function markSeen(ids) {
  const p = loadProfile();
  const now = Date.now();
  ids.forEach((id, i) => { p.seen[id] = now + i; });
  save(p);
}

// Enregistre un score. Retourne { isRecord, previousBest }.
export function recordScore(mode, score) {
  const p = loadProfile();
  const previousBest = p.best[mode] ?? null;
  const isRecord = previousBest == null || score > previousBest;
  if (isRecord) p.best[mode] = score;
  p.plays += 1;
  p.last = { mode, score, at: Date.now() };
  save(p);
  return { isRecord, previousBest };
}

export function resetProfile() {
  save(empty());
}
