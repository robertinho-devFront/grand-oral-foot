// Dessine le diplôme en PNG (1600 x 1131, format A4 paysage) avec un canvas.
// Utilisé pour l'e-mail (pièce jointe + image dans le corps) et le téléchargement.

const C = { paper: "#F3EFE3", ink: "#1A1F1B", pitch: "#0F3B2A", card: "#F5D21C", muted: "#5B6A60" };
const DISPLAY = '"Big Shoulders Display", "Arial Narrow", Impact, sans-serif';
const BODY = '"Barlow", system-ui, sans-serif';
const LABEL = '"Barlow Condensed", "Arial Narrow", sans-serif';

function fit(ctx, text, font, size, max) {
  let s = size;
  do { ctx.font = font.replace("{s}", s); s -= 2; } while (ctx.measureText(text).width > max && s > 20);
}

function wrap(ctx, text, max) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderDiploma({ appName, prenom, grade, score, total, date, mention, mode = "Classique" }) {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  const W = 1600, H = 1131;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");

  // Fond et double filet
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 3; ctx.strokeRect(62, 62, W - 124, H - 124);

  // Terrain en filigrane
  ctx.save(); ctx.globalAlpha = 0.07; ctx.strokeStyle = C.pitch; ctx.lineWidth = 6;
  ctx.strokeRect(220, 250, W - 440, H - 420);
  ctx.beginPath(); ctx.moveTo(W / 2, 250); ctx.lineTo(W / 2, H - 170); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, (250 + H - 170) / 2, 110, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  ctx.textAlign = "center"; ctx.fillStyle = C.ink;
  ctx.font = `700 30px ${LABEL}`;
  ctx.fillText(`DIPLÔME  ·  ${appName.toUpperCase()}`, W / 2, 160);

  fit(ctx, grade.toUpperCase(), `900 {s}px ${DISPLAY}`, 150, W - 360);
  ctx.fillText(grade.toUpperCase(), W / 2, 330);

  ctx.font = `500 34px ${BODY}`; ctx.fillStyle = C.muted;
  ctx.fillText("décerné à", W / 2, 420);

  ctx.fillStyle = C.ink;
  fit(ctx, prenom, `600 {s}px ${BODY}`, 84, W - 500);
  ctx.fillText(prenom, W / 2, 520);
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 360, 548); ctx.lineTo(W / 2 + 360, 548); ctx.stroke();

  ctx.font = `600 30px ${LABEL}`;
  ctx.fillText(`SCORE ${score}/${total}   ·   MODE ${mode.toUpperCase()}   ·   ${date.toUpperCase()}`, W / 2, 620);

  // Mention club : carton jaune incliné
  if (mention) {
    ctx.save();
    ctx.translate(W / 2, 790); ctx.rotate(-0.025);
    ctx.font = `500 30px ${BODY}`;
    const lines = wrap(ctx, mention.line, 780);
    const h = 90 + lines.length * 40;
    ctx.fillStyle = C.card; ctx.fillRect(-470, -h / 2, 940, h);
    ctx.fillStyle = C.ink; ctx.font = `700 28px ${LABEL}`;
    ctx.fillText(`MENTION SPÉCIALE · ${mention.club.toUpperCase()}`, 0, -h / 2 + 50);
    ctx.font = `500 30px ${BODY}`;
    lines.forEach((l, i) => ctx.fillText(l, 0, -h / 2 + 96 + i * 40));
    ctx.restore();
  }

  // Sceau
  ctx.save(); ctx.translate(W - 210, H - 210); ctx.rotate(-0.2);
  ctx.fillStyle = C.pitch; ctx.beginPath(); ctx.arc(0, 0, 92, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.card; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 78, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = C.card; ctx.textAlign = "center"; ctx.font = `900 64px ${DISPLAY}`; ctx.fillText(String(score), 0, 22);
  ctx.restore();

  ctx.textAlign = "left"; ctx.fillStyle = C.muted; ctx.font = `600 24px ${LABEL}`;
  ctx.fillText("ET TOI, TU FERAIS COMBIEN ?", 120, H - 110);

  return cv.toDataURL("image/png");
}
