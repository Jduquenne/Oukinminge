class InterfaceSearchbar {
    /**
     *
     * @param {google.maps.Map} map
     * @param {*|jQuery} container
     */
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