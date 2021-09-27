class InterfaceSearchbar {
    constructor(map, container) {
        this.searchBox = new google.maps.places.SearchBox(container);
        this.map = map;
        this.markers = []
    }

    initSearchBoxAutocomplete() {
        this.map.addListener("bounds_changed", () => {
            this.searchBox.setBounds(this.map.getBounds());
        });

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
                    return;
                }

                if( place.photos.length > 0){
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

}
export { InterfaceSearchbar }