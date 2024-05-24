<<<<<<< HEAD
let map;
let service;
let infowindow;
let marker;
let markers = [];
let selectedTypes = ['library', 'book_store', 'park', 'gym', 'school', 'university'];

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 15
            });

            infowindow = new google.maps.InfoWindow();

            marker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Localização Atual"
            });

            map.addListener('click', function(event) {
                const clickedLocation = event.latLng;

                marker.setPosition(clickedLocation);
                map.setCenter(clickedLocation);

                searchNearby(clickedLocation);
            });

            map.addListener('mousemove', function(event) {
                document.getElementById('lat').textContent = event.latLng.lat().toFixed(6);
                document.getElementById('lng').textContent = event.latLng.lng().toFixed(6);
            });

            searchNearby(userLocation);

            document.querySelectorAll('.filter input').forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    selectedTypes = Array.from(document.querySelectorAll('.filter input:checked')).map((input) => input.value);
                    searchNearby(marker.getPosition());
                });
            });
        }, () => {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
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

function searchNearby(location) {
    clearMarkers();

    selectedTypes.forEach((type) => {
        const request = {
            location: location,
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
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function addCustomLocation() {
    const name = document.getElementById('location-name').value;
    const lat = parseFloat(document.getElementById('location-lat').value);
    const lng = parseFloat(document.getElementById('location-lng').value);

    if (name && !isNaN(lat) && !isNaN(lng)) {
        const customLocation = { name: name, geometry: { location: new google.maps.LatLng(lat, lng) } };
        createCustomMarker(customLocation);
        map.setCenter(customLocation.geometry.location);
    } else {
        alert('Por favor, preencha todos os campos com valores válidos.');
    }
}

function createCustomMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
=======
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
>>>>>>> fbb4404f7324fa1e38b88df8fe946547fff7adbf
