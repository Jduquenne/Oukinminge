import { GOOGLE_MAP_API_KEY } from "./config.js";
import { AppController } from "./Controllers/AppController.js";

// Création du script de l'Api Google Map

// Clé api à définir dans le fichier de config.js
let googleApiScript = document.createElement('script');
googleApiScript.src = 'https://maps.googleapis.com/maps/api/js?key='+ GOOGLE_MAP_API_KEY +'&libraries=places&callback=onGoogleLoaded&v=weekly&language=fr';
googleApiScript.async = true;
document.head.append(googleApiScript);

// Initialisation de l'application
window.onGoogleLoaded = () => {
    const app = new AppController();
    app.initApp().then();
}


