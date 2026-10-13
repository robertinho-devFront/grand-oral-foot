/**
 * Le Grand Oral du Foot : diplômes par e-mail, liste d'abonnés et newsletter.
 *
 * Où coller ce fichier : dans une feuille Google Sheets → Extensions → Apps Script.
 * Première fois : choisir la fonction « installer » et cliquer sur Exécuter (voir le README).
 *
 * Ce que fait le script :
 *  1. Reçoit chaque formulaire de fin de quiz (adresse, prénom, club, score, image du diplôme).
 *  2. Enregistre ou met à jour l'abonné dans l'onglet « Abonnés » (une ligne par adresse).
 *  3. Garde l'historique dans l'onglet « Diplômes ».
 *  4. Envoie immédiatement le diplôme par e-mail depuis ton Gmail.
 *  5. Gère la désinscription en un clic (lien en bas de chaque e-mail).
 *  6. Envoie les newsletters écrites dans l'onglet « Newsletter », à la date choisie.
 */

const CONFIG = {
  appName: "Le Grand Oral du Foot",
  siteUrl: "https://robertinho-devfront.github.io/grand-oral-foot/",
  senderName: "Le Grand Oral du Foot",
  maxImageBytes: 2000000,   // 2 Mo maximum pour l'image du diplôme
  maxDiplomasPerDay: 5,     // par adresse e-mail
  quotaReserve: 5,          // e-mails gardés en réserve pour les diplômes quand la newsletter part
};

const SHEETS = {
  subscribers: { name: "Abonnés", headers: ["E-mail", "Prénom", "Club", "Statut", "Meilleur score", "Mode du record", "Diplôme", "Parties", "Inscription", "Dernière activité", "Variante A/B"] },
  diplomas: { name: "Diplômes", headers: ["Date", "E-mail", "Prénom", "Club", "Score", "Mode", "Diplôme", "Scores par manche", "Variante A/B", "Envoi"] },
  newsletter: { name: "Newsletter", headers: ["Statut", "Date d'envoi", "Objet", "Message", "Envoyés", "Dernier envoi"] },
};
const COL = { email: 1, prenom: 2, club: 3, statut: 4, best: 5, bestMode: 6, grade: 7, plays: 8, created: 9, updated: 10, ab: 11 };
const LEVEL_NAMES = ["Manche 1", "Manche 2", "Manche 3", "Manche 4"];

/* =====================================================================
 * 1. Réception du formulaire (appelé par le site)
 * ===================================================================== */
function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const email = String(d.email || "").trim().toLowerCase().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false, error: "invalid_email" });
    if (d.consent !== true) return json({ ok: false, error: "no_consent" });

    const v = {
      email: email,
      prenom: clean(d.prenom, 40) || "Supporter",
      club: clean(d.club, 40),
      mention: clean(d.mention, 140),
      score: clampInt(d.score, 0, 40),
      total: clampInt(d.total, 1, 40) || 40,
      grade: clean(d.grade, 40),
      gradeLine: clean(d.gradeLine, 120),
      mode: clean(d.mode, 20) || "Classique",
      levels: Array.isArray(d.levels) ? d.levels.slice(0, 4).map(function (n) { return clampInt(n, 0, 10); }) : [],
      ab: clean(d.ab_diploma_gate, 4),
    };
    v.shareUrl = CONFIG.siteUrl + "#defi-" + v.score + "-" + ({ "Classique": "c", "Confirmé": "f", "Expert": "e" }[v.mode] || "c");

    // Anti-abus : le même diplôme une seule fois par heure, et 5 diplômes par jour maximum.
    const cache = CacheService.getScriptCache();
    const keyBase = "d_" + Utilities.base64EncodeWebSafe(email).slice(0, 180);
    const sameKey = keyBase + "_" + v.score + "_" + v.mode;
    if (cache.get(sameKey)) return json({ ok: false, error: "rate_limited" });
    const dayCount = parseInt(cache.get(keyBase + "_day") || "0", 10);
    if (dayCount >= CONFIG.maxDiplomasPerDay) return json({ ok: false, error: "rate_limited" });
    if (MailApp.getRemainingDailyQuota() < 1) return json({ ok: false, error: "quota" });

    const blob = decodePng(d.diploma, "diplome-" + v.score + "-sur-" + v.total + ".png");

    // Enregistrement (verrou pour éviter deux écritures simultanées)
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    let sub;
    try {
      sub = upsertSubscriber(v);
      sheet(SHEETS.diplomas).appendRow([new Date(), v.email, v.prenom, v.club, v.score, v.mode, v.grade, v.levels.join(" / "), v.ab, "envoyé"]);
    } finally {
      lock.releaseLock();
    }

    sendDiplomaEmail(v, blob, sub);
    cache.put(sameKey, "1", 3600);
    cache.put(keyBase + "_day", String(dayCount + 1), 21600);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "server" });
  }
}

/* =====================================================================
 * 2. Pages web : désinscription et test de bon fonctionnement
 * ===================================================================== */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === "desinscription") {
    const email = String(p.e || "").toLowerCase();
    if (!email || p.t !== token(email)) return page("Lien invalide", "Ce lien de désinscription n'est pas valide. Réponds simplement STOP à l'un de nos e-mails.");
    setStatus(email, "Désabonné");
    return page("C'est noté", "Tu ne recevras plus nos e-mails. Ton diplôme reste à toi. Tu peux te réinscrire à tout moment en refaisant le quiz.");
  }
  return json({ ok: true, service: CONFIG.appName, quotaRestant: MailApp.getRemainingDailyQuota() });
}

/* =====================================================================
 * 3. Abonnés
 * ===================================================================== */
function upsertSubscriber(v) {
  const sh = sheet(SHEETS.subscribers);
  const row = findRow(sh, v.email);
  const now = new Date();
  if (row) {
    const r = sh.getRange(row, 1, 1, SHEETS.subscribers.headers.length).getValues()[0];
    const best = Number(r[COL.best - 1]) || 0;
    const isBest = v.score >= best;
    sh.getRange(row, 1, 1, SHEETS.subscribers.headers.length).setValues([[
      v.email, v.prenom, v.club || r[COL.club - 1], "Abonné",
      isBest ? v.score : best, isBest ? v.mode : r[COL.bestMode - 1], isBest ? v.grade : r[COL.grade - 1],
      (Number(r[COL.plays - 1]) || 0) + 1, r[COL.created - 1] || now, now, r[COL.ab - 1] || v.ab,
    ]]);
    return { isNew: false, best: Math.max(best, v.score), previousBest: best };
  }
  sh.appendRow([v.email, v.prenom, v.club, "Abonné", v.score, v.mode, v.grade, 1, now, now, v.ab]);
  return { isNew: true, best: v.score, previousBest: null };
}

function findRow(sh, email) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const values = sh.getRange(2, COL.email, last - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) if (String(values[i][0]).toLowerCase() === email) return i + 2;
  return 0;
}

function setStatus(email, status) {
  const sh = sheet(SHEETS.subscribers);
  const row = findRow(sh, email);
  if (row) { sh.getRange(row, COL.statut).setValue(status); sh.getRange(row, COL.updated).setValue(new Date()); }
}

/* =====================================================================
 * 4. E-mail du diplôme
 * ===================================================================== */
function sendDiplomaEmail(v, blob, sub) {
  const levels = v.levels.map(function (n, i) {
    return '<tr><td style="padding:6px 0;border-bottom:1px solid #DDE3DC;font:600 14px Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;color:#1A1F1B">' +
      LEVEL_NAMES[i] + '</td><td align="right" style="padding:6px 0;border-bottom:1px solid #DDE3DC;font:700 14px Arial,sans-serif;color:#1A1F1B">' + n + "/10</td></tr>";
  }).join("");

  const recordLine = sub.isNew ? "" :
    (v.score > sub.previousBest ? "<strong>Nouveau record personnel !</strong> Tu bats ton ancien score de " + sub.previousBest + "/40. " :
      "Ton record reste " + sub.best + "/40. ");

  const mention = v.club
    ? '<tr><td style="padding:0 32px 24px"><table role="presentation" width="100%" style="background:#F5D21C"><tr><td style="padding:14px 18px;font:14px Arial,sans-serif;color:#14140A">' +
      '<strong style="text-transform:uppercase;letter-spacing:1px">Mention spéciale · ' + esc(v.club) + "</strong><br>" + esc(v.mention) + "</td></tr></table></td></tr>"
    : "";

  const image = blob
    ? '<tr><td style="padding:0 32px 24px"><img src="cid:diplome" width="536" alt="Diplôme ' + esc(v.grade) + " décerné à " + esc(v.prenom) + ", score " + v.score + " sur " + v.total + '" style="display:block;width:100%;height:auto;border:0"></td></tr>'
    : "";

  const next = v.mode !== "Expert" && v.score >= 34
    ? "<p style=\"margin:0 0 12px\">Avec un tel score, essaie le mode " + (v.mode === "Classique" ? "Confirmé" : "Expert") + " : les questions y sont nettement plus pointues.</p>"
    : "";

  const body =
    '<tr><td style="padding:32px 32px 8px;font:800 34px/1.05 Arial Narrow,Arial,sans-serif;text-transform:uppercase;color:#1A1F1B">Bravo ' + esc(v.prenom) + ",<br>tu es " + esc(v.grade) + ".</td></tr>" +
    '<tr><td style="padding:8px 32px 24px;font:16px/1.5 Arial,sans-serif;color:#3D4A42"><p style="margin:0 0 12px">Score final : <strong>' + v.score + "/" + v.total + "</strong> en mode " + esc(v.mode) + ". " + esc(v.gradeLine) + "</p>" +
    '<p style="margin:0 0 12px">' + recordLine + "Ton diplôme est en pièce jointe, prêt à être imprimé ou partagé.</p>" + next + "</td></tr>" +
    image + mention +
    '<tr><td style="padding:0 32px 24px"><table role="presentation" width="100%">' + levels + "</table></td></tr>" +
    '<tr><td style="padding:0 32px 32px"><a href="' + esc(v.shareUrl) + '" style="display:inline-block;background:#F5D21C;color:#14140A;font:700 15px Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:14px 22px">Défie tes potes : ils feraient combien ?</a></td></tr>';

  const options = {
    to: v.email,
    subject: v.prenom + ", ton diplôme : " + v.grade + " (" + v.score + "/" + v.total + ")",
    name: CONFIG.senderName,
    htmlBody: layout(body, v.email),
    body: v.prenom + ", tu as obtenu " + v.score + "/" + v.total + " en mode " + v.mode + " : " + v.grade + ". Défie tes potes : " + v.shareUrl +
      "\n\nSe désinscrire : " + unsubscribeUrl(v.email),
  };
  if (blob) { options.inlineImages = { diplome: blob }; options.attachments = [blob]; }
  MailApp.sendEmail(options);
}

/* =====================================================================
 * 5. Newsletter
 *
 * Dans l'onglet « Newsletter », une ligne = un envoi :
 *   Statut       : « Brouillon » (ignoré) ou « À envoyer »
 *   Date d'envoi : à partir de quand l'envoi peut partir
 *   Objet        : l'objet de l'e-mail
 *   Message      : le texte. Une ligne vide = un nouveau paragraphe.
 *                  Variables : {prenom} {club} {meilleur_score} {diplome} {lien_defi} {site}
 * Le script passe toutes les heures, envoie aux abonnés et reprend où il s'était arrêté
 * si le quota quotidien de Gmail est atteint. Statut final : « Envoyée ».
 * ===================================================================== */
function envoyerNewsletters() {
  const nl = sheet(SHEETS.newsletter);
  const last = nl.getLastRow();
  if (last < 2) return;
  const rows = nl.getRange(2, 1, last - 1, SHEETS.newsletter.headers.length).getValues();
  const started = Date.now();

  for (let i = 0; i < rows.length; i++) {
    const [status, date, subject, message, sentCount] = rows[i];
    if (!/^(à envoyer|en cours)$/i.test(String(status).trim())) continue;
    if (date && new Date(date) > new Date()) continue;
    if (!subject || !message) continue;

    const subs = activeSubscribers();
    let k = Number(sentCount) || 0;
    nl.getRange(i + 2, 1).setValue("En cours");
    while (k < subs.length) {
      if (MailApp.getRemainingDailyQuota() <= CONFIG.quotaReserve) break;
      if (Date.now() - started > 5 * 60 * 1000) break; // Apps Script coupe à 6 minutes
      sendNewsletterTo(subs[k], subject, message);
      k++;
      nl.getRange(i + 2, 5, 1, 2).setValues([[k, new Date()]]);
    }
    if (k >= subs.length) nl.getRange(i + 2, 1).setValue("Envoyée");
    return; // une newsletter à la fois
  }
}

function activeSubscribers() {
  const sh = sheet(SHEETS.subscribers);
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, SHEETS.subscribers.headers.length).getValues()
    .filter(function (r) { return String(r[COL.statut - 1]) === "Abonné"; })
    .map(function (r) {
      return { email: r[COL.email - 1], prenom: r[COL.prenom - 1], club: r[COL.club - 1], best: r[COL.best - 1], mode: r[COL.bestMode - 1], grade: r[COL.grade - 1] };
    });
}

function sendNewsletterTo(s, subject, message) {
  const modeCode = { "Classique": "c", "Confirmé": "f", "Expert": "e" }[s.mode] || "c";
  const vars = {
    prenom: s.prenom || "",
    club: s.club || "ton club",
    meilleur_score: String(s.best),
    diplome: s.grade || "",
    lien_defi: CONFIG.siteUrl + "#defi-" + s.best + "-" + modeCode,
    site: CONFIG.siteUrl,
  };
  const fill = function (t) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); };
  const text = fill(message);
  const html = text.split(/\n\s*\n/).map(function (p) {
    return '<p style="margin:0 0 14px">' + esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0F3B2A">$1</a>') + "</p>";
  }).join("");
  const body =
    '<tr><td style="padding:32px 32px 8px;font:800 30px/1.05 Arial Narrow,Arial,sans-serif;text-transform:uppercase;color:#1A1F1B">' + esc(fill(subject)) + "</td></tr>" +
    '<tr><td style="padding:8px 32px 8px;font:16px/1.55 Arial,sans-serif;color:#3D4A42">' + html + "</td></tr>" +
    '<tr><td style="padding:0 32px 32px"><a href="' + esc(CONFIG.siteUrl) + '" style="display:inline-block;background:#F5D21C;color:#14140A;font:700 15px Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:14px 22px">Rejouer et battre mon record</a></td></tr>';
  MailApp.sendEmail({
    to: s.email,
    subject: fill(subject),
    name: CONFIG.senderName,
    htmlBody: layout(body, s.email),
    body: text + "\n\n" + CONFIG.siteUrl + "\n\nSe désinscrire : " + unsubscribeUrl(s.email),
  });
}

/* =====================================================================
 * 6. Installation (à lancer une fois depuis l'éditeur)
 * ===================================================================== */
function installer() {
  Object.keys(SHEETS).forEach(function (k) { sheet(SHEETS[k]); });
  token("init");

  // Exemples de newsletters, en brouillon : rien ne part tant que le statut n'est pas « À envoyer ».
  const nl = sheet(SHEETS.newsletter);
  if (nl.getLastRow() < 2) {
    nl.getRange(2, 1, 3, 4).setValues([
      ["Brouillon", "", "{prenom}, la question piège de la semaine",
        "Salut {prenom},\n\nCette semaine : de quelle forme étaient les poteaux de Glasgow sur lesquels Saint-Étienne a buté en finale de la Coupe des clubs champions 1976 ?\n\nRéponse dans la prochaine newsletter. En attendant, ton record est de {meilleur_score}/40. Tu peux faire mieux : {site}"],
      ["Brouillon", "", "Le mode Expert t'attend, {prenom}",
        "Salut {prenom},\n\nTon diplôme actuel : {diplome}, avec {meilleur_score}/40.\n\nLe quiz compte maintenant plus de 500 questions. Chaque partie pioche celles que tu n'as jamais vues, et le mode Expert ne garde que les questions de consultants et d'archivistes.\n\nEnvoie ton défi à un pote qui supporte un autre club que {club} : {lien_defi}"],
      ["Brouillon", "", "Bientôt : le tennis et l'athlétisme",
        "Salut {prenom},\n\nLe principe du Grand Oral arrive bientôt pour le tennis et l'athlétisme. Tu seras parmi les premiers prévenus.\n\nD'ici là, ton record foot est de {meilleur_score}/40 : {site}"],
    ]);
  }

  // Déclencheur horaire pour la newsletter (créé une seule fois).
  const exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === "envoyerNewsletters"; });
  if (!exists) ScriptApp.newTrigger("envoyerNewsletters").timeBased().everyHours(1).create();

  testEnvoi();
  Logger.log("Installation terminée. Quota d'e-mails restant aujourd'hui : " + MailApp.getRemainingDailyQuota());
}

/** Envoie un diplôme de test à ton adresse (utile après une modification). */
function testEnvoi() {
  const me = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  const res = doPost({ postData: { contents: JSON.stringify({
    email: me, consent: true, prenom: "Test", club: "OM", mention: "Premier club français champion d'Europe, en 1993.",
    score: 27, total: 40, grade: "Consultant TV", gradeLine: "Solide, documenté, crédible en plateau.", mode: "Classique", levels: [9, 8, 6, 4],
  }) } });
  Logger.log(res.getContent());
}

/** Envoie la première newsletter « À envoyer » ou « Brouillon » uniquement à toi, pour relecture. */
function testNewsletter() {
  const nl = sheet(SHEETS.newsletter);
  const r = nl.getRange(2, 1, 1, 4).getValues()[0];
  const me = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  sendNewsletterTo({ email: me, prenom: "Test", club: "OM", best: 27, mode: "Classique", grade: "Consultant TV" }, r[2], r[3]);
  Logger.log("Newsletter de test envoyée à " + me);
}

/* =====================================================================
 * Utilitaires
 * ===================================================================== */
function layout(rows, email) {
  return '<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#E9EFE7">' +
    '<table role="presentation" width="100%" style="background:#E9EFE7"><tr><td align="center" style="padding:24px 12px">' +
    '<table role="presentation" width="600" style="max-width:600px;width:100%;background:#FFFFFF">' +
    '<tr><td style="background:#0F3B2A;padding:24px 32px;font:700 13px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#EEF5EA">' + esc(CONFIG.appName) + "</td></tr>" +
    rows +
    '<tr><td style="padding:20px 32px;background:#F3EFE3;font:12px/1.5 Arial,sans-serif;color:#5B6A60">Tu reçois cet e-mail car tu as demandé ton diplôme sur ' + esc(CONFIG.appName) +
    '. <a href="' + esc(unsubscribeUrl(email)) + '" style="color:#5B6A60">Se désinscrire en un clic</a>.</td></tr>' +
    "</table></td></tr></table></body></html>";
}

function unsubscribeUrl(email) {
  let base = "";
  try { base = ScriptApp.getService().getUrl(); } catch (e) {}
  if (!base) return CONFIG.siteUrl;
  return base + "?action=desinscription&e=" + encodeURIComponent(email) + "&t=" + token(email);
}

function token(email) {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty("SECRET");
  if (!secret) { secret = Utilities.getUuid() + Utilities.getUuid(); props.setProperty("SECRET", secret); }
  const sig = Utilities.computeHmacSha256Signature(String(email).toLowerCase(), secret);
  return Utilities.base64EncodeWebSafe(sig).replace(/=+$/, "").slice(0, 24);
}

function sheet(def) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(def.name);
  if (!sh) {
    sh = ss.insertSheet(def.name);
    sh.appendRow(def.headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, def.headers.length).setFontWeight("bold").setBackground("#0F3B2A").setFontColor("#EEF5EA");
  }
  return sh;
}

function decodePng(b64, name) {
  if (!b64) return null;
  try {
    const bytes = Utilities.base64Decode(String(b64));
    const isPng = bytes.length > 8 && bytes[0] === -119 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    if (!isPng || bytes.length > CONFIG.maxImageBytes) return null;
    return Utilities.newBlob(bytes, "image/png", name);
  } catch (e) {
    return null;
  }
}

function page(title, text) {
  return HtmlService.createHtmlOutput(
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<div style="font-family:Arial,sans-serif;max-width:520px;margin:48px auto;padding:0 16px;color:#1A1F1B">' +
    '<p style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#0F3B2A;font-weight:700">' + esc(CONFIG.appName) + "</p>" +
    "<h1>" + esc(title) + "</h1><p style=\"font-size:17px;line-height:1.5\">" + esc(text) + "</p>" +
    '<p><a href="' + esc(CONFIG.siteUrl) + '" style="color:#0F3B2A">Retour au quiz</a></p></div>'
  ).setTitle(title);
}

function clean(s, max) {
  return String(s || "")
    .replace(/https?:\/\/\S+|www\.\S+/gi, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function clampInt(n, min, max) {
  n = parseInt(n, 10);
  return isNaN(n) ? min : Math.max(min, Math.min(max, n));
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
