import { GOOGLE_MAP_API_KEY } from "./config.js";
import { AppController } from "./Controllers/AppController.js";

let googleApiScript = document.createElement('script');
googleApiScript.src = 'https://maps.googleapis.com/maps/api/js?key='+ GOOGLE_MAP_API_KEY +'&libraries=places&callback=onGoogleLoaded&v=weekly&language=fr';
googleApiScript.async = true;
document.head.append(googleApiScript);

window.onGoogleLoaded = function(){
    const app = new AppController();
    app.initApp();
}


