import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, GRADES, REGIONS, gradeFor } from "./data/questions.js";
import { APP_NAME, SITE_URL, QUESTIONS_PER_LEVEL } from "./config.js";
import { drawSession } from "./lib/draw.js";
import { variant, COPY } from "./lib/ab.js";
import { track } from "./lib/track.js";
import { subscribe } from "./lib/newsletter.js";

const LETTERS = ["A", "B", "C", "D"];
const TOTAL = LEVELS.length * QUESTIONS_PER_LEVEL;
const pad2 = (n) => String(n).padStart(2, "0");

function readChallenge() {
  try {
    const m = /^#defi-(\d{1,2})$/.exec(window.location.hash || "");
    if (m && +m[1] <= TOTAL) return +m[1];
  } catch (e) {}
  return null;
}
function shareBase() {
  if (SITE_URL) return SITE_URL;
  try { return window.location.href.split("#")[0].split("?")[0]; } catch (e) { return ""; }
}

/* Met le focus sur le titre principal de chaque nouvel écran (lecteurs d'écran + tabulation). */
function useFocusOnMount(dep) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.focus({ preventScroll: false }); }, [dep]);
  return ref;
}

function Brand() {
  return <p className="brand"><span className="card" aria-hidden="true" />{APP_NAME}</p>;
}

function LevelList({ current = -1, scores, label = "Les quatre niveaux" }) {
  return (
    <ol className="levels" aria-label={label}>
      {LEVELS.map((l, i) => (
        <li key={l.name} className={i === current ? "on" : scores && scores[i] != null && i < current ? "done" : ""} aria-current={i === current ? "step" : undefined}>
          <b aria-hidden="true">{i + 1}</b>
          <span>{l.name}<span className="sr-only">, niveau {i + 1}</span></span>
          <span className="tag">{scores && scores[i] != null ? `${scores[i]}/${QUESTIONS_PER_LEVEL}` : `${QUESTIONS_PER_LEVEL} questions`}</span>
        </li>
      ))}
    </ol>
  );
}

function PitchIllustration() {
  return (
    <svg className="pitch-art" viewBox="0 0 320 200" role="img" aria-labelledby="pitch-art-title">
      <title id="pitch-art-title">Schéma d'un terrain de football vu du dessus, avec un ballon au point de penalty</title>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="312" height="192" />
        <line x1="160" y1="4" x2="160" y2="196" />
        <circle cx="160" cy="100" r="30" />
        <rect x="4" y="52" width="46" height="96" />
        <rect x="270" y="52" width="46" height="96" />
        <rect x="4" y="78" width="16" height="44" />
        <rect x="300" y="78" width="16" height="44" />
      </g>
      <circle cx="268" cy="100" r="7" className="ball" />
    </svg>
  );
}

/* ---------------- Accueil ---------------- */
function Home({ onStart, challenge }) {
  const headRef = useFocusOnMount("home");
  const cta = COPY.hero_cta[variant("hero_cta")];
  useEffect(() => { track("home_view", { challenge: challenge != null }); }, [challenge]);

  return (
    <>
      <main id="main">
      <div className="split">
        <section className="pitch" aria-labelledby="home-title">
          <Brand />
          <h1 id="home-title" ref={headRef} tabIndex={-1}>Vous <em>parlez</em> foot. Prouvez-le.</h1>
          <p className="lead">Le quiz football des vrais connaisseurs : 40 questions de journalistes sportifs, 4 niveaux, un diplôme à la clé. Comptez 8 minutes.</p>
          <PitchIllustration />
          <dl className="stats">
            <div><dt>questions</dt><dd>{TOTAL}</dd></div>
            <div><dt>niveaux</dt><dd>{LEVELS.length}</dd></div>
            <div><dt>continents</dt><dd>{REGIONS.length}</dd></div>
          </dl>
        </section>
        <section className="locker" aria-labelledby="home-start">
          <div className="locker-inner">
            {challenge != null && (
              <p className="challenge" role="status">Un ami a fait <strong>{challenge}/{TOTAL}</strong>. Vous feriez combien ?</p>
            )}
            <p className="eyebrow">Football · Saison 1</p>
            <h2 id="home-start">De la tribune à la légende.</h2>
            <p className="muted">Chaque partie tire de nouvelles questions dans une banque de 60, d'Europe, d'Amérique du Sud, d'Afrique, d'Asie et d'Amérique du Nord.</p>
            <LevelList />
            <div className="row">
              <button className="btn" type="button" onClick={onStart}>{cta} <span aria-hidden="true">→</span></button>
            </div>
            <p className="hint">Tout se joue au clavier : <kbd>Tab</kbd> pour naviguer, <kbd>A</kbd> à <kbd>D</kbd> pour répondre, <kbd>Entrée</kbd> pour valider.</p>
          </div>
        </section>
      </div>

      <div className="page">
        <section className="band" aria-labelledby="how">
          <h2 id="how">Comment ça marche</h2>
          <ol className="steps">
            <li><h3>Répondez</h3><p>Quatre choix par question. Après chaque réponse, une anecdote vous dit pourquoi.</p></li>
            <li><h3>Montez de niveau</h3><p>Dix questions par niveau, de plus en plus pointues. Bilan à chaque mi-temps.</p></li>
            <li><h3>Décrochez le diplôme</h3><p>Recevez-le par e-mail, puis envoyez votre score à vos potes : et toi, tu ferais combien ?</p></li>
          </ol>
        </section>

        <section className="band" aria-labelledby="grades">
          <h2 id="grades">Les diplômes</h2>
          <ul className="grade-cards">
            {[...GRADES].reverse().map((g, i, arr) => (
              <li key={g.name}>
                <span className="range">{g.min}–{i < arr.length - 1 ? arr[i + 1].min - 1 : TOTAL}</span>
                <h3>{g.name}</h3>
                <p>{g.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="band" aria-labelledby="faq">
          <h2 id="faq">Questions fréquentes</h2>
          <div className="faq">
            <details><summary>Le quiz est-il gratuit ?</summary><p>Oui. L'e-mail sert seulement à recevoir le diplôme et la newsletter. Désinscription en un clic.</p></details>
            <details><summary>Les questions changent-elles à chaque partie ?</summary><p>Oui. Chaque niveau tire 10 questions parmi 15, en mélangeant les continents et l'ordre des réponses.</p></details>
            <details><summary>Quel niveau faut-il pour obtenir le diplôme ?</summary><p>Tout le monde repart avec un diplôme. Sous 15 bonnes réponses, c'est celui de Footix certifié.</p></details>
            <details><summary>D'autres sports arrivent-ils ?</summary><p>Le tennis et l'athlétisme sont prévus. Inscrivez-vous à la fin du quiz pour être prévenu.</p></details>
          </div>
          <div className="row"><button className="btn" type="button" onClick={onStart}>{cta} <span aria-hidden="true">→</span></button></div>
        </section>
      </div>
      </main>
      <footer className="foot"><p>{APP_NAME} · Quiz football · Les questions portent sur des faits établis au 1er octobre 2026.</p></footer>
    </>
  );
}

/* ---------------- Question ---------------- */
function Play({ qs, idx, answers, onAnswer, onNext }) {
  const item = qs[idx];
  const level = Math.floor(idx / QUESTIONS_PER_LEVEL);
  const chosen = answers[idx];
  const revealed = chosen != null;
  const correct = answers.filter((a, i) => a === qs[i].a).length;
  const streak = useMemo(() => {
    let s = 0;
    for (let i = revealed ? idx : idx - 1; i >= 0; i--) { if (answers[i] === qs[i].a) s++; else break; }
    return s;
  }, [answers, idx, revealed, qs]);
  const levelScores = LEVELS.map((_, l) => (l < level ? answers.slice(l * 10, l * 10 + 10).filter((a, k) => a === qs[l * 10 + k].a).length : null));

  const headRef = useFocusOnMount(idx);
  const nextRef = useRef(null);
  useEffect(() => { if (revealed && nextRef.current) nextRef.current.focus(); }, [revealed]);

  useEffect(() => {
    const onKey = (e) => {
      if (revealed || e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key.toUpperCase();
      const n = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ["1", "2", "3", "4"].indexOf(k);
      if (n >= 0) { e.preventDefault(); onAnswer(n); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, onAnswer]);

  const isLast = idx === qs.length - 1;
  const endsLevel = (idx + 1) % QUESTIONS_PER_LEVEL === 0;
  const good = chosen === item.a;

  return (
    <div className="split">
      <aside className="pitch" aria-label="Progression">
        <Brand />
        <div>
          <p className="eyebrow">Niveau {level + 1} · {LEVELS[level].name}</p>
          <p className="board" aria-label={`Question ${idx + 1} sur ${TOTAL}`}>
            <span aria-hidden="true">{pad2(idx + 1)[0]}</span><span aria-hidden="true">{pad2(idx + 1)[1]}</span><small aria-hidden="true">/{TOTAL}</small>
          </p>
        </div>
        <div className="meter" aria-hidden="true">
          {qs.map((q, i) => <i key={q.id} className={i === idx && !revealed ? "now" : answers[i] == null ? "" : answers[i] === q.a ? "ok" : "ko"} />)}
        </div>
        <dl className="stats">
          <div><dt>bonnes réponses</dt><dd>{correct}</dd></div>
          <div><dt>série en cours</dt><dd>{streak}</dd></div>
        </dl>
        <div className="hide-sm push"><LevelList current={level} scores={levelScores} label="Niveaux et scores" /></div>
      </aside>

      <main id="main" className="locker">
        <div className="locker-inner" key={idx}>
          <p className="eyebrow enter">{LEVELS[level].sub} · <span className="region">{item.region}</span></p>
          <h1 className="q enter" id="q-text" ref={headRef} tabIndex={-1}>
            <span className="sr-only">Question {idx + 1} sur {TOTAL}. </span>{item.q}
          </h1>
          <div className="choices enter" role="group" aria-labelledby="q-text">
            {item.o.map((opt, i) => {
              let cls = "choice";
              if (revealed) cls += i === item.a ? " good" : i === chosen ? " bad" : " dim";
              const state = revealed ? (i === item.a ? ", bonne réponse" : i === chosen ? ", votre réponse, incorrecte" : "") : "";
              return (
                <button key={opt} type="button" className={cls} aria-disabled={revealed} onClick={() => !revealed && onAnswer(i)}
                  aria-label={`${LETTERS[i]} : ${opt}${state}`}>
                  <span className="k" aria-hidden="true">{LETTERS[i]}</span><span aria-hidden="true">{opt}</span>
                </button>
              );
            })}
          </div>
          <div aria-live="polite" aria-atomic="true">
            {revealed && (
              <div className={"verdict enter" + (good ? "" : " ko")}>
                <p className="v-title">{good ? (streak >= 3 ? `But ! Série de ${streak}.` : "But !") : `Hors-jeu. La bonne réponse : ${item.o[item.a]}.`}</p>
                <p>{item.i}</p>
              </div>
            )}
          </div>
          {revealed && (
            <div className="row enter">
              <button className="btn" type="button" ref={nextRef} onClick={onNext}>
                {isLast ? "Coup de sifflet final" : endsLevel ? `Fin du niveau ${level + 1}` : "Question suivante"} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Mi-temps ---------------- */
function LevelUp({ level, score, total, onContinue }) {
  const headRef = useFocusOnMount(level);
  const msg = score >= 8 ? "Récital." : score >= 5 ? "Copie propre." : "Il va falloir élever le niveau.";
  return (
    <div className="split">
      <aside className="pitch" aria-label="Bilan du niveau">
        <Brand />
        <p className="eyebrow">Mi-temps · Niveau {level + 1} terminé</p>
        <p className="board" aria-label={`${score} sur ${QUESTIONS_PER_LEVEL}`}><span aria-hidden="true">{score}</span><small aria-hidden="true">/{QUESTIONS_PER_LEVEL}</small></p>
        <p className="lead">{msg} {total} bonnes réponses au total.</p>
      </aside>
      <main id="main" className="locker">
        <div className="locker-inner enter">
          <p className="eyebrow">Niveau suivant</p>
          <h1 className="h2" ref={headRef} tabIndex={-1}>Niveau {level + 2} : {LEVELS[level + 1].name}</h1>
          <p className="muted">{LEVELS[level + 1].sub}. Les questions montent d'un cran.</p>
          <div className="row"><button className="btn" type="button" onClick={onContinue}>Reprendre le jeu <span aria-hidden="true">→</span></button></div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Fin ---------------- */
function End({ score, levelScores, onRestart }) {
  const grade = gradeFor(score);
  const gate = variant("diploma_gate"); // A = flouté jusqu'à l'inscription, B = visible
  const headRef = useFocusOnMount("end");
  const [form, setForm] = useState({ prenom: "", email: "", club: "", consent: false });
  const [status, setStatus] = useState("idle"); // idle | saving | done | disabled | error
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const shareUrl = shareBase() + "#defi-" + score;
  const shareText = `J'ai fait ${score}/${TOTAL} au ${APP_NAME} (${grade.name}). Et toi, tu ferais combien ? ${shareUrl}`;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const unlocked = gate === "B" || status === "done" || status === "disabled";
  const errRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const email = form.email.trim();
    let msg = "";
    if (!form.prenom.trim()) msg = "Indiquez votre prénom : il sera inscrit sur le diplôme.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) msg = "Cette adresse e-mail ne semble pas valide. Vérifiez-la.";
    else if (!form.consent) msg = "Cochez la case pour recevoir le diplôme et la newsletter.";
    if (msg) { setErr(msg); setTimeout(() => errRef.current && errRef.current.focus(), 0); return; }
    setStatus("saving");
    const row = { prenom: form.prenom.trim().slice(0, 60), email: email.slice(0, 120), club: form.club.trim().slice(0, 60), score, grade: grade.name, sport: "football", consent: true, ab_diploma_gate: gate, at: new Date().toISOString() };
    try {
      const r = await subscribe(row);
      setStatus(r === "saved" ? "done" : "disabled");
      if (r === "saved") track("signup", { score, grade: grade.name });
    } catch (e2) {
      setStatus("error");
      setErr("L'inscription n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez.");
    }
  };

  const copy = async () => {
    track("share_copy", { score });
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch (e) { const el = document.getElementById("share-input"); if (el) { el.focus(); el.select(); } }
  };

  return (
    <div className="split">
      <aside className="pitch" aria-label="Résultat">
        <Brand />
        <p className="eyebrow">Coup de sifflet final</p>
        <p className="board" aria-label={`${score} sur ${TOTAL}`}>
          <span aria-hidden="true">{pad2(score)[0]}</span><span aria-hidden="true">{pad2(score)[1]}</span><small aria-hidden="true">/{TOTAL}</small>
        </p>
        <h1 className="h2" ref={headRef} tabIndex={-1}><span className="sr-only">Votre diplôme : </span>{grade.name}</h1>
        <p className="lead">{grade.line}</p>
        <LevelList scores={levelScores} label="Score par niveau" />
      </aside>

      <main id="main" className="locker">
        <div className="locker-inner enter">
          <figure className={"diploma" + (unlocked ? "" : " locked")} aria-label={unlocked ? `Diplôme ${grade.name}, score ${score} sur ${TOTAL}` : "Diplôme masqué : inscrivez-vous pour le débloquer"}>
            {!unlocked && <div className="lock" aria-hidden="true"><span>Débloquez votre diplôme ↓</span></div>}
            <div className="d-eyebrow">Diplôme · {APP_NAME}</div>
            <div className="d-title">{grade.name}</div>
            <div>décerné à</div>
            <div className="d-name">{form.prenom || "Votre prénom"}</div>
            <div className="d-meta"><span>Score {score}/{TOTAL}</span><span>Football</span><span>{today}</span></div>
            <div className="seal" aria-hidden="true">{score}</div>
          </figure>

          {status === "done" ? (
            <p className="ok-msg" role="status">C'est validé, {form.prenom}. Votre diplôme part vers {form.email}.</p>
          ) : status === "disabled" ? (
            <p className="muted" role="status">Les inscriptions ouvrent bientôt. Votre diplôme est débloqué ci-dessus.</p>
          ) : (
            <form className="signup" onSubmit={submit} noValidate aria-labelledby="signup-title">
              <h2 id="signup-title" className="h3">{gate === "A" ? "Débloquez votre diplôme" : "Recevez votre diplôme par e-mail"}</h2>
              <p className="muted">Et une question piège chaque semaine dans votre boîte.</p>
              <div className="two">
                <div className="field"><label htmlFor="f-prenom">Prénom</label><input id="f-prenom" name="prenom" autoComplete="given-name" required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
                <div className="field"><label htmlFor="f-club">Club de cœur <span className="opt">(facultatif)</span></label><input id="f-club" name="club" value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} /></div>
              </div>
              <div className="field"><label htmlFor="f-email">E-mail</label><input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" required aria-describedby={err ? "f-err" : undefined} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="consent">
                <input id="f-consent" type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                <label htmlFor="f-consent">J'accepte de recevoir mon diplôme et la newsletter. Désinscription en un clic.</label>
              </div>
              {err && <p className="err" id="f-err" role="alert" tabIndex={-1} ref={errRef}>{err}</p>}
              <div className="row"><button className="btn" type="submit" disabled={status === "saving"}>{status === "saving" ? "Envoi…" : "Recevoir mon diplôme"}</button></div>
            </form>
          )}

          <div className="share">
            <h2 className="h3" id="share-title">Défiez vos potes</h2>
            <div className="share-box">
              <label htmlFor="share-input" className="sr-only">Message de défi à copier</label>
              <input id="share-input" readOnly value={shareText} onFocus={(e) => e.target.select()} />
              <button className="btn" type="button" onClick={copy}>{copied ? "Copié" : "Copier"}</button>
            </div>
            <p className="sr-only" aria-live="polite">{copied ? "Message copié dans le presse-papiers." : ""}</p>
          </div>
          <div className="row"><button className="btn ghost" type="button" onClick={onRestart}>Rejouer avec de nouvelles questions</button></div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- App ---------------- */
const TITLES = {
  home: `${APP_NAME} · Quiz football : testez vos connaissances`,
  play: `Quiz en cours · ${APP_NAME}`,
  levelup: `Mi-temps · ${APP_NAME}`,
  end: `Votre diplôme · ${APP_NAME}`,
};

export default function App() {
  const [phase, setPhase] = useState("home");
  const [qs, setQs] = useState(() => drawSession());
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const challenge = useMemo(readChallenge, []);

  const score = answers.filter((a, i) => a === qs[i].a).length;
  const levelScores = LEVELS.map((_, l) => answers.slice(l * 10, l * 10 + 10).filter((a, k) => a === qs[l * 10 + k].a).length);

  useEffect(() => { document.title = TITLES[phase]; window.scrollTo(0, 0); }, [phase, idx]);

  const start = () => {
    track(phase === "end" ? "replay" : "quiz_start", { challenge: challenge != null });
    setQs(drawSession()); setAnswers([]); setIdx(0); setPhase("play");
  };
  const answer = useCallback((i) => {
    setAnswers((prev) => {
      if (prev[idx] != null) return prev;
      const n = prev.slice(); n[idx] = i;
      track("answer", { question_id: qs[idx].id, region: qs[idx].region, level: qs[idx].level + 1, correct: i === qs[idx].a });
      return n;
    });
  }, [idx, qs]);
  const next = () => {
    if (idx === qs.length - 1) { track("quiz_finish", { score, grade: gradeFor(score).name }); return setPhase("end"); }
    if ((idx + 1) % QUESTIONS_PER_LEVEL === 0) {
      const l = Math.floor(idx / QUESTIONS_PER_LEVEL);
      track("level_complete", { level: l + 1, score: levelScores[l] });
      return setPhase("levelup");
    }
    setIdx(idx + 1);
  };
  const resume = () => { setIdx(idx + 1); setPhase("play"); };

  return (
    <>
      <a className="skip" href="#main">Aller au contenu</a>
      {phase === "home" && <Home onStart={start} challenge={challenge} />}
      {phase === "play" && <Play qs={qs} idx={idx} answers={answers} onAnswer={answer} onNext={next} />}
      {phase === "levelup" && <LevelUp level={Math.floor(idx / QUESTIONS_PER_LEVEL)} score={levelScores[Math.floor(idx / QUESTIONS_PER_LEVEL)]} total={score} onContinue={resume} />}
      {phase === "end" && <End score={score} levelScores={levelScores} onRestart={start} />}
    </>
  );
}
