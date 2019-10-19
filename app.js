var data = fetch('https://opendata.jena.de/data/verkehrsbehinderung.geojson');
var currentPosition;
var currentPositionMarker;
var red = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var black = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var orange = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    minZoom: 2
}).addTo(map);

getLocation(map);

data.features.forEach(feature => {
    if (feature.properties["Art der Sperrung"] == "Vollsperrung") {
        console.log(feature);
        var latlng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        var marker = new L.marker(latlng, {
            icon: red
        }).addTo(map);
        createJamMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0], 100, map);
        marker.bindPopup("<b>Vollsperrung</b><br>Grund: " + feature.properties["Grund der Sperrung"]);
    } else if (feature.properties["Art der Sperrung"] == "Verkehrsraumeinschränkung") {
        console.log(feature);
        var latlng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        var marker = new L.marker(latlng, {
            icon: orange
        }).addTo(map);
        createWarnMarker(feature.geometry.coordinates[1], feature.geometry.coordinates[0], 100, map);
        marker.bindPopup("<b>Verkehrsraumeinschränkung</b><br>Grund: " + feature.properties["Grund der Einschränkung"]);
    }
});

function createRoute(e) {
    var clickMarker = L.marker(e.latlng).addTo(map);
    var control = L.Routing.control({
        waypoints: [
            L.latLng(currentPosition),
            L.latLng(e.latlng)
        ],
        showAlternatives: true
    }).addTo(map);
    control.on('routesfound', function(gotData) {
        console.log(gotData);
        gotData.routes.forEach(route => {
            if (isBlocked(route, data.features)) {}
        });
    });

}
map.on('click', createRoute);

function isBlocked(route, blocks) {
    var isB = false;
    route.coordinates.forEach(routePoints => {
        blocks.forEach(block => {
            if (((block.geometry.coordinates[1] - routePoints["lat"]) < 0.0000000000001 && (block.geometry.coordinates[0] - routePoints["lng"]) < 0.0000000000001)) {
                isB = true;
                return true;
            }
        });
    });
    return isB;
}

function getLocation(map) {
    navigator.geolocation.getCurrentPosition(function(location) {
        currentPosition = new L.LatLng(location.coords.latitude, location.coords.longitude);
        currentPositionMarker = new L.marker(currentPosition, {
            icon: black
        }).addTo(map);
        map.setView(currentPosition);
        currentPositionMarker.bindPopup("Dein Standort: " + location.coords.latitude + ", " + location.coords.longitude);
    });
}

function createJamMarker(lat, lng, radius, map) {
    var circle = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radius
    }).addTo(map);
}

function createWarnMarker(lat, lng, radius, map) {
    var circle = L.circle([lat, lng], {
        color: 'orange',
        fillColor: '#FFA600',
        fillOpacity: 0.5,
        radius: radius
    }).addTo(map);
}