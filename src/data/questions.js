// Banque de 60 questions : 15 par niveau. Chaque partie en tire 10 par niveau,
// en couvrant le plus de continents possible (voir lib/draw.js).
// a = index de la bonne réponse dans o. region sert au tirage et aux stats A/B.

export const LEVELS = [
  { name: "Tribune", sub: "Les classiques qu'on doit connaître" },
  { name: "Vestiaire", sub: "Les moments qui ont fait l'histoire" },
  { name: "Banc de touche", sub: "Là où les consultants se régalent" },
  { name: "Légende", sub: "Pour les archivistes du ballon rond" },
];

export const REGIONS = ["Europe", "Amérique du Sud", "Afrique", "Asie-Océanie", "Amérique du Nord"];

export const BANK = [
  // ---------- Niveau 1 — Tribune ----------
  { id: "t01", level: 0, region: "Europe", q: "En quelle année la France a-t-elle remporté sa première Coupe du monde ?", o: ["1984", "1998", "2000", "2006"], a: 1, i: "Le 12 juillet 1998, 3-0 face au Brésil au Stade de France." },
  { id: "t02", level: 0, region: "Europe", q: "Qui a marqué deux buts de la tête en finale de la Coupe du monde 1998 ?", o: ["Thierry Henry", "Emmanuel Petit", "Zinédine Zidane", "David Trezeguet"], a: 2, i: "Zidane double la mise sur deux corners, Petit clôt le score en fin de match." },
  { id: "t03", level: 0, region: "Europe", q: "Quel club a remporté le plus de Ligues des champions ?", o: ["AC Milan", "Bayern Munich", "Liverpool", "Real Madrid"], a: 3, i: "Le Real Madrid compte 15 titres, loin devant le Milan AC (7)." },
  { id: "t04", level: 0, region: "Amérique du Sud", q: "Quel joueur détient le record de Ballons d'or ?", o: ["Lionel Messi", "Cristiano Ronaldo", "Michel Platini", "Johan Cruyff"], a: 0, i: "Messi en a remporté 8, le dernier en 2023. Ronaldo en compte 5." },
  { id: "t05", level: 0, region: "Asie-Océanie", q: "Quel pays a organisé la Coupe du monde 2022 ?", o: ["Russie", "Qatar", "Arabie saoudite", "Émirats arabes unis"], a: 1, i: "Première Coupe du monde organisée en hiver, en novembre-décembre 2022." },
  { id: "t06", level: 0, region: "Europe", q: "Comment s'appelle le stade historique du FC Barcelone ?", o: ["Santiago Bernabéu", "Mestalla", "Camp Nou", "Wanda Metropolitano"], a: 2, i: "Inauguré en 1957, c'est le plus grand stade d'Europe." },
  { id: "t07", level: 0, region: "Europe", q: "Quel club français a remporté la Ligue des champions en 1993 ?", o: ["AS Monaco", "Olympique de Marseille", "Paris Saint-Germain", "Girondins de Bordeaux"], a: 1, i: "1-0 contre l'AC Milan à Munich, but de la tête de Basile Boli." },
  { id: "t08", level: 0, region: "Europe", q: "Quelle sélection a remporté l'Euro 2016 organisé en France ?", o: ["Portugal", "France", "Allemagne", "Pays de Galles"], a: 0, i: "Le Portugal bat la France 1-0 en prolongation grâce à Éder." },
  { id: "t09", level: 0, region: "Europe", q: "Quel est le surnom de l'équipe nationale d'Italie ?", o: ["La Roja", "Les Diables rouges", "La Squadra Azzurra", "La Celeste"], a: 2, i: "Le bleu vient de la maison de Savoie, ancienne famille royale." },
  { id: "t10", level: 0, region: "Amérique du Sud", q: "Combien de Coupes du monde le Brésil a-t-il remportées entre 1958 et 2002 ?", o: ["3", "4", "5", "6"], a: 2, i: "1958, 1962, 1970, 1994 et 2002." },
  { id: "t11", level: 0, region: "Amérique du Nord", q: "Quels pays co-organisent la Coupe du monde 2026 ?", o: ["États-Unis et Mexique", "États-Unis, Canada et Mexique", "États-Unis et Canada", "Canada et Mexique"], a: 1, i: "Première édition à 48 équipes et première organisée par trois pays." },
  { id: "t12", level: 0, region: "Asie-Océanie", q: "Quels pays ont co-organisé la Coupe du monde 2002 ?", o: ["Chine et Japon", "Japon et Corée du Sud", "Corée du Sud et Chine", "Japon et Australie"], a: 1, i: "Première Coupe du monde en Asie et première co-organisée." },
  { id: "t13", level: 0, region: "Amérique du Sud", q: "Dans quel club brésilien Pelé a-t-il fait l'essentiel de sa carrière ?", o: ["Flamengo", "Corinthians", "Santos", "São Paulo"], a: 2, i: "De 1956 à 1974, avant de partir aux États-Unis." },
  { id: "t14", level: 0, region: "Afrique", q: "Roger Milla a fait danser le monde au Mondial 1990 sous le maillot de quel pays ?", o: ["Nigeria", "Cameroun", "Côte d'Ivoire", "Ghana"], a: 1, i: "À 38 ans, ses célébrations au poteau de corner sont restées cultes." },
  { id: "t15", level: 0, region: "Afrique", q: "Quel pays est devenu le premier pays africain demi-finaliste d'une Coupe du monde ?", o: ["Sénégal", "Ghana", "Maroc", "Cameroun"], a: 2, i: "Le Maroc l'a fait au Qatar en 2022, après avoir éliminé l'Espagne et le Portugal." },

  // ---------- Niveau 2 — Vestiaire ----------
  { id: "v01", level: 1, region: "Europe", q: "Qui était le sélectionneur de la France championne du monde en 2018 ?", o: ["Laurent Blanc", "Didier Deschamps", "Raymond Domenech", "Zinédine Zidane"], a: 1, i: "Deschamps devient le 3e homme champion du monde comme joueur et comme sélectionneur." },
  { id: "v02", level: 1, region: "Europe", q: "Contre quelle sélection la France a-t-elle perdu la finale de la Coupe du monde 2006 ?", o: ["Allemagne", "Brésil", "Portugal", "Italie"], a: 3, i: "1-1 après prolongation, puis 5-3 aux tirs au but à Berlin." },
  { id: "v03", level: 1, region: "Europe", q: "Quel défenseur italien a reçu le coup de tête de Zidane en finale 2006 ?", o: ["Fabio Cannavaro", "Alessandro Nesta", "Marco Materazzi", "Gianluca Zambrotta"], a: 2, i: "Materazzi avait aussi marqué l'égalisation italienne en première mi-temps." },
  { id: "v04", level: 1, region: "Europe", q: "Quel club anglais est surnommé « The Invincibles » pour sa saison 2003-2004 ?", o: ["Manchester United", "Chelsea", "Arsenal", "Liverpool"], a: 2, i: "Champion sans la moindre défaite en 38 matchs de Premier League." },
  { id: "v05", level: 1, region: "Amérique du Sud", q: "Quel pays a remporté la toute première Coupe du monde, en 1930 ?", o: ["Uruguay", "Argentine", "Italie", "Brésil"], a: 0, i: "Pays organisateur, l'Uruguay bat l'Argentine 4-2 en finale à Montevideo." },
  { id: "v06", level: 1, region: "Amérique du Sud", q: "Quel joueur a marqué la célèbre « main de Dieu » en 1986 ?", o: ["Pelé", "Diego Maradona", "Mario Kempes", "Gabriel Batistuta"], a: 1, i: "Contre l'Angleterre en quart de finale, quatre minutes avant le « but du siècle »." },
  { id: "v07", level: 1, region: "Europe", q: "Qui a marqué le but de la victoire allemande en finale de la Coupe du monde 2014 ?", o: ["Thomas Müller", "Miroslav Klose", "Mario Götze", "Toni Kroos"], a: 2, i: "À la 113e minute contre l'Argentine, au Maracanã." },
  { id: "v08", level: 1, region: "Europe", q: "Quel club détient le record de titres de champion de France ?", o: ["AS Saint-Étienne", "Olympique de Marseille", "Paris Saint-Germain", "Olympique lyonnais"], a: 2, i: "Le PSG a dépassé Saint-Étienne et ses 10 titres." },
  { id: "v09", level: 1, region: "Amérique du Sud", q: "Quel fut le score de la demi-finale Brésil – Allemagne en 2014 ?", o: ["0-4", "1-5", "1-7", "2-6"], a: 2, i: "Cinq buts allemands en moins d'une demi-heure, à Belo Horizonte." },
  { id: "v10", level: 1, region: "Europe", q: "Quel est le seul gardien de but à avoir remporté le Ballon d'or ?", o: ["Gianluigi Buffon", "Lev Yachine", "Manuel Neuer", "Dino Zoff"], a: 1, i: "L'« Araignée noire » soviétique, sacré en 1963." },
  { id: "v11", level: 1, region: "Afrique", q: "Quel est le seul joueur africain à avoir remporté le Ballon d'or ?", o: ["Samuel Eto'o", "Didier Drogba", "George Weah", "Mohamed Salah"], a: 2, i: "Le Libérien l'a reçu en 1995, alors qu'il jouait à l'AC Milan." },
  { id: "v12", level: 1, region: "Amérique du Nord", q: "Quel Italien a manqué le dernier tir au but de la finale 1994 aux États-Unis ?", o: ["Franco Baresi", "Roberto Baggio", "Daniele Massaro", "Paolo Maldini"], a: 1, i: "Son tir passe au-dessus, au Rose Bowl de Pasadena. Le Brésil est sacré." },
  { id: "v13", level: 1, region: "Asie-Océanie", q: "Quelle sélection a battu l'Argentine, future championne, lors de son premier match au Mondial 2022 ?", o: ["Arabie saoudite", "Japon", "Corée du Sud", "Iran"], a: 0, i: "2-1, l'une des plus grosses surprises de l'histoire du tournoi." },
  { id: "v14", level: 1, region: "Amérique du Sud", q: "Quel club argentin est surnommé « Xeneizes » ?", o: ["River Plate", "Boca Juniors", "Racing Club", "San Lorenzo"], a: 1, i: "Le surnom vient des immigrés génois qui ont fondé le club dans le quartier de La Boca." },
  { id: "v15", level: 1, region: "Amérique du Sud", q: "Qui a fini meilleur buteur de la Coupe du monde 1978, remportée par l'Argentine ?", o: ["Mario Kempes", "Daniel Passarella", "Leopoldo Luque", "Osvaldo Ardiles"], a: 0, i: "6 buts, dont un doublé en finale contre les Pays-Bas." },

  // ---------- Niveau 3 — Banc de touche ----------
  { id: "b01", level: 2, region: "Europe", q: "Quel joueur détient le record de buts sur une seule édition de Coupe du monde ?", o: ["Just Fontaine", "Gerd Müller", "Ronaldo", "Eusébio"], a: 0, i: "13 buts en 1958 en Suède. Record jamais égalé." },
  { id: "b02", level: 2, region: "Europe", q: "Quel club a remporté la finale de C1 2005 après avoir été mené 3-0 à la pause ?", o: ["Manchester United", "Liverpool", "Chelsea", "FC Porto"], a: 1, i: "Le « miracle d'Istanbul » face à l'AC Milan, gagné aux tirs au but." },
  { id: "b03", level: 2, region: "Europe", q: "En quelle saison Leicester City a-t-il été sacré champion d'Angleterre ?", o: ["2013-2014", "2014-2015", "2015-2016", "2016-2017"], a: 2, i: "Les Foxes étaient cotés à 5 000 contre 1 en début de saison." },
  { id: "b04", level: 2, region: "Europe", q: "Quelle coupe d'Europe le PSG a-t-il remportée en 1996 ?", o: ["Coupe UEFA", "Coupe des vainqueurs de coupe", "Coupe Intertoto", "Supercoupe d'Europe"], a: 1, i: "1-0 contre le Rapid Vienne, but de Bruno N'Gotty." },
  { id: "b05", level: 2, region: "Europe", q: "Dans quel stade s'est jouée la finale de la Coupe du monde 1998 ?", o: ["Parc des Princes", "Stade Vélodrome", "Stade de France", "Stade de Gerland"], a: 2, i: "Le Stade de France avait été inauguré quelques mois plus tôt, en janvier 1998." },
  { id: "b06", level: 2, region: "Europe", q: "Qui a marqué le but en or en finale de l'Euro 2000 ?", o: ["Sylvain Wiltord", "Thierry Henry", "Robert Pirès", "David Trezeguet"], a: 3, i: "Reprise de volée à la 103e minute contre l'Italie à Rotterdam." },
  { id: "b07", level: 2, region: "Europe", q: "Quelle sélection a créé la surprise en remportant l'Euro 2004 ?", o: ["Grèce", "République tchèque", "Danemark", "Turquie"], a: 0, i: "La Grèce bat le Portugal 1-0 en finale, à Lisbonne." },
  { id: "b08", level: 2, region: "Europe", q: "Qui était le sélectionneur de l'équipe de France en 1998 ?", o: ["Michel Hidalgo", "Roger Lemerre", "Aimé Jacquet", "Gérard Houllier"], a: 2, i: "Très critiqué avant le tournoi, Jacquet quitte son poste en champion du monde." },
  { id: "b09", level: 2, region: "Amérique du Sud", q: "Qui a reçu le Ballon d'or du meilleur joueur de la Coupe du monde 2022 ?", o: ["Kylian Mbappé", "Lionel Messi", "Luka Modrić", "Antoine Griezmann"], a: 1, i: "Messi devient le premier joueur à recevoir ce trophée deux fois (2014 et 2022)." },
  { id: "b10", level: 2, region: "Europe", q: "Quel club allemand a perdu la finale de C1 2013 face au Bayern Munich ?", o: ["Bayer Leverkusen", "Schalke 04", "Borussia Dortmund", "VfL Wolfsburg"], a: 2, i: "Première finale 100 % allemande, à Wembley, 2-1 pour le Bayern." },
  { id: "b11", level: 2, region: "Afrique", q: "Qui a marqué le but de la victoire du Sénégal contre la France en ouverture du Mondial 2002 ?", o: ["El Hadji Diouf", "Papa Bouba Diop", "Henri Camara", "Khalilou Fadiga"], a: 1, i: "1-0 à Séoul. Les Bleus, tenants du titre, sortent sans marquer un but." },
  { id: "b12", level: 2, region: "Afrique", q: "Quel pays a remporté la Coupe d'Afrique des nations 2019 en Égypte ?", o: ["Sénégal", "Nigeria", "Algérie", "Tunisie"], a: 2, i: "1-0 en finale contre le Sénégal, but de Baghdad Bounedjah dès la 2e minute." },
  { id: "b13", level: 2, region: "Asie-Océanie", q: "Quel sélectionneur a mené la Corée du Sud en demi-finale de la Coupe du monde 2002 ?", o: ["Guus Hiddink", "Dick Advocaat", "Philippe Troussier", "Bora Milutinović"], a: 0, i: "Le Néerlandais a éliminé l'Italie puis l'Espagne avec les Coréens." },
  { id: "b14", level: 2, region: "Amérique du Nord", q: "Quelle sélection a remporté le plus de Gold Cup de la CONCACAF ?", o: ["États-Unis", "Mexique", "Costa Rica", "Canada"], a: 1, i: "Le Mexique devance largement les États-Unis au palmarès." },
  { id: "b15", level: 2, region: "Amérique du Sud", q: "Quelle joueuse détient le record de buts en Coupe du monde, hommes et femmes confondus ?", o: ["Birgit Prinz", "Abby Wambach", "Marta", "Christine Sinclair"], a: 2, i: "La Brésilienne compte 17 buts en phase finale de Coupe du monde." },

  // ---------- Niveau 4 — Légende ----------
  { id: "l01", level: 3, region: "Europe", q: "Quel arrêt de 1995 a bouleversé le marché des transferts en Europe ?", o: ["L'arrêt Bosman", "L'arrêt Webster", "L'arrêt Malaja", "L'arrêt Kolpak"], a: 0, i: "Du nom du Belge Jean-Marc Bosman : libre transfert en fin de contrat dans l'UE." },
  { id: "l02", level: 3, region: "Amérique du Sud", q: "Comment appelle-t-on la défaite du Brésil face à l'Uruguay au Maracanã en 1950 ?", o: ["Le Mineirazo", "Le Maracanaço", "Le Centenario", "Le Garrinchazo"], a: 1, i: "Un traumatisme national. Le Brésil abandonne ensuite son maillot blanc." },
  { id: "l03", level: 3, region: "Europe", q: "En quelle année le gardien a-t-il perdu le droit de prendre à la main une passe en retrait volontaire ?", o: ["1986", "1990", "1992", "1996"], a: 2, i: "Une réponse directe au jeu très fermé de la Coupe du monde 1990." },
  { id: "l04", level: 3, region: "Europe", q: "La « panenka » tire son nom d'un joueur de quelle sélection ?", o: ["Hongrie", "Yougoslavie", "Pologne", "Tchécoslovaquie"], a: 3, i: "Antonín Panenka l'a tentée lors de la séance de tirs au but décisive de la finale de l'Euro 1976." },
  { id: "l05", level: 3, region: "Europe", q: "Pendant combien de temps Alex Ferguson a-t-il entraîné Manchester United ?", o: ["Environ 20 ans", "Environ 23 ans", "Environ 26 ans", "Environ 30 ans"], a: 2, i: "De novembre 1986 à mai 2013, avec 13 titres de champion d'Angleterre." },
  { id: "l06", level: 3, region: "Europe", q: "Quel club français a disputé la toute première finale de Coupe des clubs champions en 1956 ?", o: ["Stade de Reims", "OGC Nice", "AS Saint-Étienne", "Racing Club de Paris"], a: 0, i: "Défaite 4-3 contre le Real Madrid, au Parc des Princes." },
  { id: "l07", level: 3, region: "Europe", q: "Quel attaquant du Bayern Munich était surnommé « Der Bomber » ?", o: ["Karl-Heinz Rummenigge", "Gerd Müller", "Uwe Seeler", "Jürgen Klinsmann"], a: 1, i: "Müller a inscrit 365 buts en Bundesliga, un record longtemps resté hors d'atteinte." },
  { id: "l08", level: 3, region: "Europe", q: "Combien de buts Michel Platini a-t-il marqués lors de l'Euro 1984 ?", o: ["5", "7", "9", "11"], a: 2, i: "En seulement 5 matchs, dont deux triplés." },
  { id: "l09", level: 3, region: "Amérique du Sud", q: "Quel pays a conservé définitivement le trophée Jules-Rimet en 1970 ?", o: ["Italie", "Uruguay", "Allemagne de l'Ouest", "Brésil"], a: 3, i: "Troisième sacre brésilien. Le trophée a été volé à Rio en 1983 et jamais retrouvé." },
  { id: "l10", level: 3, region: "Amérique du Nord", q: "Lors de quelle Coupe du monde les cartons jaunes et rouges ont-ils été introduits ?", o: ["1962", "1966", "1970", "1974"], a: 2, i: "Au Mexique, sur une idée de l'arbitre anglais Ken Aston, inspiré par des feux de circulation." },
  { id: "l11", level: 3, region: "Amérique du Sud", q: "Quel club détient le record de victoires en Copa Libertadores ?", o: ["Boca Juniors", "Peñarol", "Independiente", "River Plate"], a: 2, i: "Le club d'Avellaneda compte 7 titres, dont 4 consécutifs de 1972 à 1975." },
  { id: "l12", level: 3, region: "Asie-Océanie", q: "Quelle sélection a remporté le plus de Coupes d'Asie des nations ?", o: ["Arabie saoudite", "Iran", "Corée du Sud", "Japon"], a: 3, i: "Le Japon compte 4 titres : 1992, 2000, 2004 et 2011." },
  { id: "l13", level: 3, region: "Asie-Océanie", q: "En quelle année l'Australie a-t-elle quitté la confédération d'Océanie pour rejoindre l'Asie ?", o: ["1998", "2002", "2006", "2010"], a: 2, i: "Un choix pour affronter une concurrence plus relevée en qualifications." },
  { id: "l14", level: 3, region: "Amérique du Nord", q: "Dans quel club américain Pelé a-t-il terminé sa carrière ?", o: ["LA Galaxy", "New York Cosmos", "Chicago Sting", "Tampa Bay Rowdies"], a: 1, i: "De 1975 à 1977, dans la NASL, aux côtés de Franz Beckenbauer." },
  { id: "l15", level: 3, region: "Afrique", q: "Quel pays détient le record de victoires en Coupe d'Afrique des nations ?", o: ["Cameroun", "Ghana", "Nigeria", "Égypte"], a: 3, i: "L'Égypte compte 7 titres, dont trois consécutifs entre 2006 et 2010." },
];

// Grades du diplôme. Footix = celui qui parle fort mais connaît mal.
export const GRADES = [
  { min: 34, name: "Légende du vestiaire", line: "Vous pourriez animer l'avant-match." },
  { min: 25, name: "Consultant TV", line: "Solide, documenté, crédible en plateau." },
  { min: 15, name: "Titulaire indiscutable", line: "Le fond de jeu est là. Les archives vous attendent." },
  { min: 0, name: "Footix certifié", line: "Le maillot est neuf, la mémoire aussi. On retente ?" },
];
export const gradeFor = (s) => GRADES.find((g) => s >= g.min);
