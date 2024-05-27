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

                const name = prompt('Insira o nome do local:');
                if (name) {
                    const customLocation = {
                        name: name,
                        geometry: { location: clickedLocation }
                    };
                    addCustomLocationToServer(name, clickedLocation.lat(), clickedLocation.lng());
                    createCustomMarker(customLocation);
                }
            });

            map.addListener('mousemove', function(event) {
                document.getElementById('lat').textContent = event.latLng.lat().toFixed(6);
                document.getElementById('lng').textContent = event.latLng.lng().toFixed(6);
            });

            searchNearby(userLocation);
            loadLocationsFromServer();

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

function addCustomLocationToServer(name, lat, lng) {
    fetch('http://localhost:3000/locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, latitude: lat, longitude: lng })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Local adicionado:', data);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}

function loadLocationsFromServer() {
    fetch('http://localhost:3000/locations')
    .then(response => response.json())
    .then(data => {
        data.forEach(location => {
            const customLocation = {
                name: location.name,
                geometry: { location: new google.maps.LatLng(location.latitude, location.longitude) }
            };
            createCustomMarker(customLocation);
        });
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}

function addCustomLocation() {
    const name = document.getElementById('location-name').value;
    const lat = parseFloat(document.getElementById('location-lat').value);
    const lng = parseFloat(document.getElementById('location-lng').value);

    if (name && !isNaN(lat) && !isNaN(lng)) {
        const customLocation = { name: name, geometry: { location: new google.maps.LatLng(lat, lng) } };
        addCustomLocationToServer(name, lat, lng);
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
