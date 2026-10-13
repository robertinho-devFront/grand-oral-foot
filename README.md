# Le Grand Oral du Foot

Quiz football en React (Vite), publié sur GitHub Pages :

- 543 questions sur 4 niveaux de difficulté ;
- 40 questions par partie, jamais les mêmes d'une partie à l'autre ;
- 3 modes : Classique, Confirmé, Expert ;
- diplôme envoyé par e-mail, avec une mention spéciale selon le club ;
- liste d'abonnés et newsletter dans Google Sheets ;
- lien de défi entre amis.

Site : https://robertinho-devfront.github.io/grand-oral-foot/

## Publier une mise à jour

Double-clique sur `publier.bat`, ou dans GitHub Desktop : **Commit to main**, puis **Push origin**.
GitHub vérifie la banque de questions, construit le site et le met en ligne en 1 à 2 minutes. Suis l'avancement dans l'onglet **Actions** du dépôt.

Pour lancer le site en local : `npm install`, puis `npm run dev`.

## Envoi du diplôme et newsletter (gratuit, 15 minutes)

GitHub Pages n'a pas de serveur. Un script Google Apps Script, lié à une feuille Google Sheets, fait tout le travail :

| Onglet | Contenu |
|---|---|
| **Abonnés** | Une ligne par adresse : prénom, club, statut (Abonné / Désabonné), meilleur score, mode, nombre de parties |
| **Diplômes** | L'historique de chaque diplôme envoyé |
| **Newsletter** | Tes envois : objet, message, date, statut |

### Mise en place

1. Sur drive.google.com, crée une feuille Google Sheets vide nommée « Grand Oral – Abonnés ».
2. Dans la feuille : **Extensions → Apps Script**. Efface le code par défaut, colle tout le contenu de `apps-script/Code.gs`, puis enregistre (icône disquette).
3. En haut, choisis la fonction **installer** et clique sur **Exécuter**.
   - Google demande des autorisations : clique sur « Examiner les autorisations », choisis ton compte, puis « Paramètres avancés », « Accéder au projet (non sécurisé) » et enfin « Autoriser ».
   - L'avertissement est normal pour un script personnel.
   - Résultat : les trois onglets sont créés et tu reçois un diplôme de test par e-mail.
4. **Déployer → Nouveau déploiement**. Clique sur la roue dentée et choisis **Application Web**.
   - « Exécuter en tant que » : **Moi**.
   - « Qui a accès » : **Tout le monde**.
   - Clique sur **Déployer**, puis copie l'**URL de l'application Web**, qui se termine par `/exec`.
5. Vérifie : colle cette URL dans ton navigateur. Tu dois voir `{"ok":true,...}`.
6. Colle l'URL dans `src/config.js`, entre les guillemets de `DIPLOMA_ENDPOINT`, puis publie la mise à jour.

À partir de là, chaque joueur qui remplit le formulaire reçoit son diplôme automatiquement et apparaît dans l'onglet « Abonnés ».

### Envoyer une newsletter

1. Dans l'onglet **Newsletter**, écris l'objet et le message. Trois exemples sont déjà prêts, en brouillon.
2. Dans le message, ces variables sont remplacées pour chaque abonné : `{prenom}`, `{club}`, `{meilleur_score}`, `{diplome}`, `{lien_defi}`, `{site}`.
3. Pour te l'envoyer d'abord à toi, lance la fonction **testNewsletter** dans Apps Script.
4. Mets le statut à **À envoyer** et choisis une date d'envoi (laisse vide pour envoyer dès que possible).
5. Le script passe toutes les heures et envoie aux abonnés actifs. La colonne « Envoyés » montre la progression, puis le statut passe à **Envoyée**.

### Limites et sécurité

- **Quota Gmail** : environ 100 e-mails par jour avec un compte gratuit, 1 500 avec Google Workspace. Au-delà, la newsletter reprend automatiquement le lendemain. Le script garde une réserve pour que les diplômes partent toujours.
- **Désinscription** : un lien signé en bas de chaque e-mail. Il marque l'abonné « Désabonné » et la newsletter ne lui est plus envoyée.
- **Anti-abus** :
  - le même diplôme n'est envoyé qu'une fois par heure à la même adresse ;
  - 5 diplômes maximum par jour et par adresse ;
  - les liens sont supprimés des champs libres ;
  - l'image doit être un vrai PNG ;
  - un champ invisible piège les robots.
- Si tu modifies `Code.gs`, va dans **Déployer → Gérer les déploiements → crayon → Version : Nouvelle version → Déployer**. L'URL ne change pas.
- La fonction `testEnvoi` n'envoie qu'un seul e-mail par heure : c'est l'anti-abus. Attends ou change le score de test dans le code.

## Les questions

543 questions dans `src/data/bank/`, un fichier par niveau de difficulté :

| Fichier | Niveau | Pour qui |
|---|---|---|
| `d1-tribune.js` | 1 · Tribune | Les classiques que tout amateur connaît |
| `d2-vestiaire.js` | 2 · Vestiaire | Les grands moments, pour les bons connaisseurs |
| `d3-banc.js` | 3 · Banc de touche | Questions de consultants |
| `d4-legende.js` | 4 · Légende | Détails cachés et archives, tous vérifiables |

Chaque question tient sur une ligne, **avec la bonne réponse en première position** (l'ordre est mélangé à l'affichage) :

```js
["H", "EU", "Question ?", "Bonne réponse", "Faux 1", "Faux 2", "Faux 3", "Anecdote affichée après la réponse."],
```

- **Catégories** : `H` histoire, `R` règles du jeu, `A` le détail qui tue, `J` joueurs & légendes, `C` clubs & stades.
- **Régions** : `EU` Europe, `SA` Amérique du Sud, `AF` Afrique, `AS` Asie-Océanie, `NA` Amérique du Nord, `MO` monde.

Après une modification, lance `npm run check`. Le script vérifie :

- le format de chaque ligne ;
- l'absence de doublons ;
- que les 4 choix sont distincts ;
- qu'il y a assez de questions par niveau.

GitHub lance aussi cette vérification à chaque publication et bloque la mise en ligne en cas d'erreur.

Les questions sur des records encore en cours sont datées (« en 2022 », « avant 2025 ») pour ne pas devenir fausses avec le temps.

## Tirage des questions et modes

- **Jamais les mêmes questions** : le navigateur du joueur retient les questions déjà posées. Chaque partie pioche d'abord parmi les questions jamais vues, puis parmi les plus anciennes. Un rafraîchissement de page ou une nouvelle partie donnent donc 40 nouvelles questions.
- **Variété** : dans chaque manche, le tirage mélange les catégories et les continents, et évite deux questions qui ont la même réponse.
- **Défi entre amis** : deux joueurs différents n'ont en moyenne que 2 ou 3 questions en commun sur 40. Le lien de défi (`#defi-27-e`) garde le score et le mode de difficulté.

Difficulté des 4 manches selon le mode :

| Mode | Manches | Conseillé quand |
|---|---|---|
| Classique | 1 · 2 · 3 · 4 | Première partie |
| Confirmé | 2 · 3 · 3 · 4 | Record de 28/40 ou plus |
| Expert | 3 · 3 · 4 · 4 | Record de 36/40 ou plus |

Le mode conseillé est présélectionné, mais le joueur peut toujours choisir. Après 34/40 ou plus, un bouton propose de passer au mode supérieur.

## Mention spéciale par club

`src/data/clubs.js` associe une phrase à plus de 30 clubs, avec leurs orthographes et surnoms : « OM », « Barça », « Saint-Étienne »…
Un club absent de la liste reçoit une mention générique.

## A/B testing et mesures

`src/lib/ab.js` attribue à chaque visiteur une variante stable :

| Expérience | A | B |
|---|---|---|
| `diploma_gate` | Diplôme flouté, e-mail requis | Diplôme visible, e-mail optionnel |
| `hero_cta` | « Commencer le quiz » | « Tester mes connaissances » |

Pour forcer une variante lors d'un test, ajoute `?ab_diploma_gate=B` à l'URL.

Les événements partent vers Google Tag Manager (`dataLayer`) et vers Plausible, s'ils sont installés :

- `home_view`
- `quiz_start`
- `answer` : id, catégorie, région, difficulté, juste ou faux
- `level_complete`
- `quiz_finish`
- `signup`
- `share_copy`
- `diploma_download`
- `replay`

L'événement `answer` sert à recalibrer la banque. Une question réussie à plus de 90 % doit descendre d'un niveau. Une question réussie à moins de 15 % doit monter d'un niveau, ou être reformulée.

## Accessibilité

- Lien d'évitement en premier arrêt de tabulation, puis navigation complète au clavier.
- Choix du mode avec les flèches ; réponses avec les touches A à D ou 1 à 4.
- Le focus passe automatiquement au titre de chaque question, puis au bouton « Question suivante ».
- Le verdict est annoncé aux lecteurs d'écran.
- Contrastes conformes AA, et animations coupées si le système le demande.
- Textes alternatifs sur le schéma du terrain, l'image de partage et le diplôme envoyé par e-mail.
