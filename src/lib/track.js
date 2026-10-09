import { allVariants } from "./ab.js";

// Envoie chaque événement vers Google Tag Manager (dataLayer) et Plausible s'ils sont installés.
// Événements : home_view, quiz_start, answer, level_complete, quiz_finish, signup, share_copy, replay.
// "answer" porte l'id et la région de la question : de quoi repérer les questions trop faciles ou trop dures.
export function track(event, props = {}) {
  const payload = { event, ...props, ...prefix(allVariants()) };
  try { (window.dataLayer = window.dataLayer || []).push(payload); } catch (e) {}
  try { if (typeof window.plausible === "function") window.plausible(event, { props: payload }); } catch (e) {}
  if (import.meta.env.DEV) console.debug("[track]", payload);
}

function prefix(v) {
  return Object.fromEntries(Object.entries(v).map(([k, val]) => ["ab_" + k, val]));
}
