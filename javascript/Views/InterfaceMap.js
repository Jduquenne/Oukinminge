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
        this.input = document.getElementById("input-search");
        this.searchBox = new google.maps.places.SearchBox(this.input);

        this.restaurants = restaurants
        this.markers = []
    }

    async initMap() {
        this.getLocalisation()
        this.initSearchBoxAutocomplete()
        this.displayMarkers()
    }

    displayMarkers() {
        for (let restaurant of this.restaurants) {
            this.addMarker(restaurant)
        }
    }

    addMarker(restaurant) {
        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#0D0D0D",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };
        const myLatLng = new google.maps.LatLng(restaurant.lat, restaurant.long);
        const marker = new google.maps.Marker({
            position: myLatLng,
            icon: svgMarker,
            title: restaurant.name,
            animation: google.maps.Animation.BOUNCE,
        })
        marker.setMap(this.map)

        this.markers.push(marker)
        return marker
    }

    getLocalisation() {
        const infoWindow = new google.maps.InfoWindow();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Vous êtes ici !");
                    infoWindow.open(this.map);
                    this.map.setCenter(pos);
                },
                () => {
                    this.handleLocationError(true, infoWindow, this.map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, this.map.getCenter());
        }
    }

    // TODO Utiliser StreetView
    initSearchBoxAutocomplete(listener) {
        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener("bounds_changed", () => {
            this.searchBox.setBounds(this.map.getBounds());
        });
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        this.searchBox.addListener("places_changed", () => {
            const places = this.searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            // Clear out the old markers.
            this.markers.forEach((marker) => {
                marker.setMap(null);
            });
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                if(place.photos.length > 0){
                    console.log(place.photos[0].getUrl())
                }

                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(70, 70),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(30, 30),
                };
                // Create a marker for each place.
                this.markers.push(
                    new google.maps.Marker({
                        map: this.map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    })
                );

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            this.map.fitBounds(bounds);
            this.map.setZoom(14)
        });
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