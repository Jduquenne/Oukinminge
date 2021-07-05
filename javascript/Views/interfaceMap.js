class interfaceMap {
    constructor() {
        this.map = {}
        this.marker = []
    }

    initMap() {
        let script = document.createElement('script');
        // TODO Cacher la KEY Google du inspect
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCKGsWfoTU9625KJ3MayRRpdqqC0Sboa9g&callback=initMap';
        script.async = true;

        window.initMap = function() {
            let googlePosition = new google.maps.LatLng(50.637026857895286, 3.063359115424543)
            this.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: googlePosition
            })
            this.marker = new google.maps.Marker({
                position: googlePosition,
                map: this.map
            });
            console.log(marker)
        };

        document.head.appendChild(script);
    }
}

export { interfaceMap }