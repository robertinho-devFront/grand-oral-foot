import { DIPLOMA_ENDPOINT } from "../config.js";

// Envoie l'inscription + le diplôme (PNG en base64) au script Google (apps-script/Code.gs),
// qui enregistre l'abonné dans Google Sheets et envoie l'e-mail depuis ton Gmail.
// Retourne "sent", "saved" (aperçu Claude) ou "disabled" (aucun script branché). Lève une erreur sinon.
export async function sendDiploma(row, pngDataUrl) {
  // Aperçu dans Claude : enregistrement dans la base de la page, sans e-mail.
  const claude = typeof window !== "undefined" ? window.claude : null;
  if (!DIPLOMA_ENDPOINT && claude && typeof claude.use === "function") {
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    const uid = user ? await user.id() : null;
    if (db && uid) { await db.doc("inscrits/" + uid).set(row); return "saved"; }
  }
  if (!DIPLOMA_ENDPOINT) return "disabled";

  // text/plain évite la requête préalable CORS, que Google Apps Script ne gère pas.
  const body = JSON.stringify({ ...row, diploma: pngDataUrl.replace(/^data:image\/png;base64,/, "") });
  let res;
  try {
    res = await fetch(DIPLOMA_ENDPOINT, { method: "POST", body, headers: { "Content-Type": "text/plain;charset=utf-8" }, redirect: "follow" });
  } catch (e) {
    // Hors ligne : vraie erreur. En ligne : la requête est partie mais la réponse est illisible
    // (blocage du navigateur) ; on ne renvoie pas pour éviter un double e-mail.
    if (typeof navigator !== "undefined" && navigator.onLine === false) throw e;
    return "sent";
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* réponse non JSON */ }
  if (data && data.ok) return "sent";
  const err = new Error((data && data.error) || "HTTP " + res.status);
  err.code = data && data.error;
  throw err;
}
