// Tout ce qui se règle sans toucher au code.

// Nom du jeu : change-le ici, il se met à jour partout dans l'app.
export const APP_NAME = "Le Grand Oral du Foot";

// URL publique du site (GitHub Pages), utilisée pour le lien de défi.
// Exemple : "https://ton-pseudo.github.io/grand-oral-foot/"
// Vide = l'URL de la page courante.
export const SITE_URL = "https://robertinho-devfront.github.io/grand-oral-foot/";

// Envoi du diplôme par e-mail. GitHub Pages n'a pas de serveur : on passe par un script
// Google Apps Script gratuit (voir apps-script/Code.gs et le README).
// Colle ici l'URL du déploiement, qui ressemble à "https://script.google.com/macros/s/XXXX/exec".
// Vide = pas d'envoi (le diplôme reste téléchargeable sur la page).
export const DIPLOMA_ENDPOINT = "";

// Questions tirées par niveau (sur 15 disponibles).
export const QUESTIONS_PER_LEVEL = 10;
