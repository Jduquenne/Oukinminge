import { GOOGLE_MAP_API_KEY } from "../config.js";

class InterfaceMap {
    /**
     *
     * @param {Object} mapParams
     * @param {Array} restaurants
     */
    constructor(mapParams, restaurants) {
        this.map = new google.maps.Map(mapParams.container, {
            zoom: mapParams.zoom,
            center:  mapParams.position,
            mapId: mapParams.mapId,
            mapTypeControl: mapParams.mapTypeControl,
            streetViewControl: mapParams.streetViewControl,
            fullscreenControl: mapParams.fullscreenControl,
        })

        this.restaurants = restaurants
        this.markers = []
        this.prevInfowindow = false
        this.markerSelected = false
    }

    async initMap() {
        this.getLocalisation()
        this.displayMarkers()
    }

    displayMarkers() {
        for (let restaurant of this.restaurants) {
            this.addMarker(restaurant)
        }
    }

    addMarker(restaurant) {
        const myLatLng = new google.maps.LatLng(restaurant.lat, restaurant.long);
        const streetViewImgContainer = document.createElement("img")
        streetViewImgContainer.src = `https://maps.googleapis.com/maps/api/streetview?location=${restaurant.lat},${restaurant.long}&size=250x250&key=${GOOGLE_MAP_API_KEY}`
        streetViewImgContainer.className = 'infoWindowImg'
        const contentString =
            '<div id="infoWindowContent">' +
                '<h3 id="infoWindowFirstHeading" class="infoWindowFirstHeading">'+ restaurant.name +'</h3>' +
                '<div id="infoWindowBodyContent">' +
                    '<p class="infoWindowAdress">'+ restaurant.adress +'</p>' +
                    streetViewImgContainer.outerHTML +
                "</div>" +
            "</div>";
        const infoWindowCustom = new google.maps.InfoWindow({
            content: contentString
        });
        const marker = new google.maps.Marker({
            position: myLatLng,
            infoWindow: infoWindowCustom,
            animation: null,
        })

        google.maps.event.addListener(marker, "click",  () => {
            // if( this.prevInfowindow ) {
            //     this.prevInfowindow.close();
            // }
            // this.prevInfowindow = infoWindowCustom;
            // marker.infoWindow.open(this.map, marker);

            if (this.markerSelected) {
                this.markerSelected.setAnimation(null);
            }
            this.markerSelected = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);

            this.map.panTo(myLatLng);
            this.map.setZoom(18)
        });

        marker.setMap(this.map)
        this.markers.push(marker)

        return marker
    }

    getLocalisation() {
        const infoWindow = new google.maps.InfoWindow();
        const options = {
            enableHighAccuracy: true,
            maximumAge: 500,
            timeout: 500
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    this.map.panTo(pos);
                    this.map.setZoom(15)
                    // if (position.coords.accuracy > 30) {
                    //     infoWindow.setPosition(pos);
                    //     const sad = String.fromCodePoint(0x1F480)
                    //     infoWindow.setContent(
                    //         `lat = ${pos.lat.toFixed(5)} long = ${pos.lng.toFixed(5)} accuracy = ${position.coords.accuracy}m de marge d'erreur. Mauvaise position ${sad}`
                    //     );
                    //     infoWindow.open(this.map);
                    //     this.map.setCenter(pos);
                    // } else {
                    //     const smile = String.fromCodePoint(0x1F600)
                    //     infoWindow.setPosition(pos);
                    //     infoWindow.setContent(`lat = ${pos.lat} long = ${pos.lng} accuracy = ${position.coords.accuracy}m de marge d'erreur. Bonne position ! ${smile}`);
                    //     infoWindow.open(this.map);
                    //     this.map.setCenter(pos);
                    // }
                },
                () => {
                    this.handleLocationError(true, infoWindow, this.map.getCenter());
                },
                options
            );
        } else {
            this.handleLocationError(false, infoWindow, this.map.getCenter());
        }
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
                ? "Error: The Geolocation service failed."
                : "Error: Your browser doesn't support geolocation."
        );
        infoWindow.open(this.map);
    }

}

export { InterfaceMap }