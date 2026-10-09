import { NEWSLETTER_ENDPOINT } from "../config.js";

// Retourne "saved" si l'inscription est enregistrée, "disabled" si aucun service n'est branché.
// Lève une erreur si l'envoi échoue.
export async function subscribe(row) {
  // Aperçu dans Claude : la page dispose d'une petite base de données.
  const claude = typeof window !== "undefined" ? window.claude : null;
  if (claude && typeof claude.use === "function") {
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    const uid = user ? await user.id() : null;
    if (db && uid) { await db.doc("inscrits/" + uid).set(row); return "saved"; }
  }

  if (!NEWSLETTER_ENDPOINT) return "disabled";

  const body = new FormData();
  body.append("EMAIL", row.email);
  body.append("email", row.email);
  body.append("PRENOM", row.prenom);
  body.append("CLUB", row.club);
  body.append("SCORE", String(row.score));
  body.append("GRADE", row.grade);
  const res = await fetch(NEWSLETTER_ENDPOINT, { method: "POST", body, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return "saved";
}
