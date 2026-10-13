// Mention spéciale inscrite sur le diplôme et dans l'e-mail selon le club de cœur.
// Ajoute un club : { names: ["nom", "alias"], line: "Phrase courte, factuelle." }

const CLUBS = [
  { names: ["psg", "paris saint germain", "paris sg", "paris"], line: "Recordman des titres de champion de France." },
  { names: ["om", "olympique de marseille", "marseille"], line: "Premier club français champion d'Europe, en 1993." },
  { names: ["ol", "olympique lyonnais", "lyon"], line: "Sept titres de champion de France d'affilée, de 2002 à 2008." },
  { names: ["asse", "saint etienne", "as saint etienne", "les verts"], line: "Les Verts de 1976 et les poteaux carrés de Glasgow." },
  { names: ["lens", "rc lens", "racing club de lens"], line: "Champion de France 1998, au cœur du pays minier." },
  { names: ["bordeaux", "girondins", "girondins de bordeaux"], line: "Six titres de champion, le dernier en 2009." },
  { names: ["nantes", "fc nantes"], line: "Huit titres et le jeu à la nantaise." },
  { names: ["monaco", "as monaco", "asm"], line: "Finaliste de la Ligue des champions en 2004." },
  { names: ["lille", "losc"], line: "Champion de France 2021, devant le PSG." },
  { names: ["rennes", "stade rennais", "srfc"], line: "Vainqueur de la Coupe de France 2019 face au PSG." },
  { names: ["nice", "ogc nice"], line: "Quatre fois champion de France dans les années 1950." },
  { names: ["reims", "stade de reims"], line: "Deux fois finaliste de la Coupe des clubs champions." },
  { names: ["strasbourg", "rc strasbourg", "racing"], line: "Champion de France 1979." },
  { names: ["real madrid", "real"], line: "Quinze Ligues des champions. Rien que ça." },
  { names: ["barcelone", "fc barcelone", "barca", "barcelona"], line: "La Masia, le Camp Nou et le tiki-taka." },
  { names: ["atletico", "atletico madrid", "atletico de madrid"], line: "Champion d'Espagne en 2014 et 2021, face aux deux géants." },
  { names: ["liverpool", "lfc"], line: "Istanbul 2005, la plus belle remontée de l'histoire de la C1." },
  { names: ["manchester united", "man united", "man utd", "united"], line: "Le triplé de 1999, arraché dans le temps additionnel." },
  { names: ["manchester city", "man city", "city"], line: "Le triplé de 2023, première C1 du club." },
  { names: ["arsenal", "gunners"], line: "Les Invincibles de 2003-2004." },
  { names: ["chelsea"], line: "Champion d'Europe en 2012 et 2021." },
  { names: ["bayern", "bayern munich", "fc bayern"], line: "Recordman des titres de champion d'Allemagne." },
  { names: ["dortmund", "borussia dortmund", "bvb"], line: "Champion d'Europe 1997 et le Mur jaune." },
  { names: ["juventus", "juve"], line: "Recordman des titres de champion d'Italie." },
  { names: ["milan", "ac milan", "milan ac"], line: "Sept Ligues des champions au palmarès." },
  { names: ["inter", "inter milan", "internazionale"], line: "Le triplé de 2010." },
  { names: ["ajax", "ajax amsterdam"], line: "Quatre C1 et l'école du football total." },
  { names: ["benfica"], line: "Double champion d'Europe, en 1961 et 1962." },
  { names: ["porto", "fc porto"], line: "Champion d'Europe 1987 et 2004." },
  { names: ["boca", "boca juniors"], line: "Six Copa Libertadores et la Bombonera qui tremble." },
  { names: ["river", "river plate"], line: "Vainqueur de la finale de Libertadores 2018 face à Boca." },
  { names: ["santos"], line: "Le club de Pelé." },
  { names: ["flamengo"], line: "Le club le plus suivi du Brésil." },
  { names: ["al ahly", "ahly"], line: "Recordman des Ligues des champions africaines." },
];

export function normalizeClub(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Retourne { club, line } : club = nom tel que saisi, line = mention (spécifique ou générique).
export function clubMention(raw) {
  const club = (raw || "").trim().slice(0, 40);
  if (!club) return null;
  const n = normalizeClub(club);
  const hit = CLUBS.find((c) => c.names.includes(n)) || CLUBS.find((c) => c.names.some((name) => name.includes(" ") && n.includes(name)));
  return { club, line: hit ? hit.line : "Fidèle au poste, dans les bons comme dans les mauvais jours." };
}
