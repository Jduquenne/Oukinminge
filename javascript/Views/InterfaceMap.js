class InterfaceMap {
    /**
     *
     * @param {Object} mapParams
     * @param {Array} restaurants
     * @param {Function} onMarkerClick
     */
    constructor(mapParams, restaurants, onMarkerClick) {
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
        this.onMarkerClick = onMarkerClick
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
        const restaurantLatLng = new google.maps.LatLng(restaurant.lat, restaurant.long);

        restaurant.marker = new google.maps.Marker({
            position: restaurantLatLng,
            positionForPanTo: new google.maps.LatLng(restaurant.lat + 0.0006, restaurant.long),
            animation: null,
        })

        google.maps.event.addListener(restaurant.marker, "click",  () => {
            this.onMarkerClick(restaurant)
        });

        restaurant.marker.setMap(this.map)
        this.markers.push(restaurant.marker)

        return restaurant.marker
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
                    this.map.setZoom(16)
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