class InterfaceMap {
    /**
     *
     * @param {Object} mapParams
     * @param {Function} onMarkerClick
     * @param {Function} onMapClick
     */
    constructor(mapParams, onMarkerClick, onMapClick) {
        this.map = new google.maps.Map(mapParams.container, {
            zoom: mapParams.zoom,
            center: mapParams.center,
            mapId: mapParams.mapId,
            mapTypeControl: mapParams.mapTypeControl,
            streetViewControl: mapParams.streetViewControl,
            fullscreenControl: mapParams.fullscreenControl,
        })
        this.markers = []
        this.onMarkerClick = onMarkerClick
        this.onMapClick = onMapClick
        this.mapListener = null
        this.markerSelected = false
        this.currentPosition = null
    }

    /**
     *
     * @param {Restaurant[]} restaurants
     * @returns {Promise<void>}
     */
    async initMap(restaurants) {
        this.displayMarkers(restaurants)
    }

    /**
     *
     * @param {Restaurant[]} restaurants
     */
    displayMarkers(restaurants) {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        for (let restaurant of restaurants) {
            this.createMarkerWithRestaurant(restaurant)
        }
    }

    setMapListener() {
        this.mapListener = google.maps.event.addListener(this.map,'click', (position) => {
            this.createMarkerWithPosition(position.latLng)
            this.onMapClick(position)
            google.maps.event.removeListener(this.mapListener)
        })
    }

    removeMapListener() {
        google.maps.event.removeListener(this.mapListener)
    }

    /**
     *
     * @param {Object} position
     */
    createMarkerWithPosition(position) {
        let marker = new google.maps.Marker({
            position: position,
            positionForPanTo: new google.maps.LatLng(position.lat + 0.0006, position.long),
            map: this.map,
        });
        this.markers.push(marker)
        // this.map.panTo(position)
        // this.map.setZoom(17)
    }

    /**
     *
     * @param {Restaurant} restaurant
     * @returns {*}
     */
    createMarkerWithRestaurant(restaurant) {
        const restaurantLatLng = new google.maps.LatLng(restaurant.lat, restaurant.long);
        const iconImage = {
            url: "assets/img/restaurant-svgrepo-com.svg",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(50, 50)
        }

        restaurant.marker = new google.maps.Marker({
            position: restaurantLatLng,
            positionForPanTo: new google.maps.LatLng(restaurant.lat + 0.0006, restaurant.long),
            icon: iconImage,
            animation: null,
        })

        google.maps.event.addListener(restaurant.marker, "click",  () => {
            this.onMarkerClick(restaurant)
        });

        restaurant.marker.setMap(this.map)
        this.markers.push(restaurant.marker)

        return restaurant.marker
    }

    /**
     *
     * @param {number} number
     */
    setZoom(number) {
        this.map.setZoom(number)
    }

    /**
     *
     * @param {Restaurant} restaurant
     */
    setCenterTo(restaurant){
        this.map.panTo(restaurant.marker.positionForPanTo);
    }

    getCurrentPosition() {
        const options = {
            enableHighAccuracy: true,
            maximumAge: 500,
            timeout: 500
        };
        return new Promise(((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        }))
    }

}

export { InterfaceMap }