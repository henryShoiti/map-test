let map;
let service;
let infowindow;

function initMap() {
    // Tenta obter a localização atual do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 15
            });

            infowindow = new google.maps.InfoWindow();

            // Define os tipos de lugares que queremos procurar
            const placeTypes = ['library', 'book_store', 'park', 'gym', 'school', 'university'];

            placeTypes.forEach((type) => {
                const request = {
                    location: userLocation,
                    radius: '1500',
                    type: [type]
                };

                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                });
            });
        }, () => {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(browserHasGeolocation ?
        'Erro: Falha ao obter localização.' :
        'Erro: Seu navegador não suporta geolocalização.');
    infowindow.open(map);
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
