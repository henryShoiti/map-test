let map;
let service;
let infowindow;
let marker;
let markers = [];
let selectedTypes = ['bibliotecas', 'livros', 'recreação', 'esportes', 'escolas', 'cursos'];

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
                const category = prompt('Escolha a categoria e digite: Bibliotecas, Livros, Recreação, Esportes, Escolas ou Cursos');
                if (name && category && selectedTypes.includes(category)) {
                    const customLocation = {
                        name: name,
                        category: category,
                        geometry: { location: clickedLocation }
                    };
                    addCustomLocationToServer(name, clickedLocation.lat(), clickedLocation.lng(), category);
                    createCustomMarker(customLocation);
                } else {
                    alert('Nome e categoria são obrigatórios e a categoria deve ser válida.');
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

function addCustomLocationToServer(name, lat, lng, category) {
    fetch('http://localhost:3000/locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, latitude: lat, longitude: lng, category })
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
                category: location.category,
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
    const category = document.getElementById('location-category').value;

    if (name && !isNaN(lat) && !isNaN(lng) && category) {
        const customLocation = { name: name, category: category, geometry: { location: new google.maps.LatLng(lat, lng) } };
        addCustomLocationToServer(name, lat, lng, category);
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
        infowindow.setContent(`${place.name} (${place.category})`);
        infowindow.open(map, this);
    });
}
