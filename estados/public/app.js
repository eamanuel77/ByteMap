const map = L.map('map').setView([6.4238, -66.5897], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const estados = [
    { nombre: "Districo Capital", capital: "Caracas", coordenadas: { lat: 10.4806, lng: -66.9036 }},
    { nombre: "Amazonas", capital: "Puerto Ayacucho", coordenadas: { lat: 5.6639, lng: -67.6236 } },
    { nombre: "Anzoátegui", capital: "Barcelona", coordenadas: { lat: 10.1333, lng: -64.6833 } },
    { nombre: "Apure", capital: "San Fernando de Apure", coordenadas: { lat: 7.8961, lng: -67.4724 } },
    { nombre: "Aragua", capital: "Maracay", coordenadas: { lat: 10.2469, lng: -67.5958 } },
    { nombre: "Barinas", capital: "Barinas", coordenadas: { lat: 8.6226, lng: -70.2075 } },
    { nombre: "Bolívar", capital: "Ciudad Bolívar", coordenadas: { lat: 8.1292, lng: -63.5409 } },
    { nombre: "Carabobo", capital: "Valencia", coordenadas: { lat: 10.162, lng: -68.007 } },
    { nombre: "Cojedes", capital: "San Carlos", coordenadas: { lat: 9.6625, lng: -68.5958 } },
    { nombre: "Delta Amacuro", capital: "Tucupita", coordenadas: { lat: 9.0622, lng: -62.0529 } },
    { nombre: "Falcón", capital: "Coro", coordenadas: { lat: 11.4069, lng: -69.6737 } },
    { nombre: "Guárico", capital: "San Juan de los Morros", coordenadas: { lat: 9.9117, lng: -67.3581 } },
    { nombre: "Lara", capital: "Barquisimeto", coordenadas: { lat: 10.0739, lng: -69.3228 } },
    { nombre: "Mérida", capital: "Mérida", coordenadas: { lat: 8.5984, lng: -71.1500 } },
    { nombre: "Miranda", capital: "Los Teques", coordenadas: { lat: 10.3442, lng: -67.0437 } },
    { nombre: "Monagas", capital: "Maturín", coordenadas: { lat: 9.7457, lng: -63.1832 } },
    { nombre: "Nueva Esparta", capital: "La Asunción", coordenadas: { lat: 11.0333, lng: -63.8628 } },
    { nombre: "Portuguesa", capital: "Guanare", coordenadas: { lat: 9.0429, lng: -69.7421 } },
    { nombre: "Sucre", capital: "Cumaná", coordenadas: { lat: 10.4542, lng: -64.1825 } },
    { nombre: "Táchira", capital: "San Cristóbal", coordenadas: { lat: 7.7669, lng: -72.2250 } },
    { nombre: "Trujillo", capital: "Trujillo", coordenadas: { lat: 9.3669, lng: -70.4361 } },
    { nombre: "Vargas", capital: "La Guaira", coordenadas: { lat: 10.5969, lng: -66.9372 } },
    { nombre: "Yaracuy", capital: "San Felipe", coordenadas: { lat: 10.3406, lng: -68.7425 } },
    { nombre: "Zulia", capital: "Maracaibo", coordenadas: { lat: 10.6316, lng: -71.6406 } }
];

let currentCapitalIndex = 0;

function irACapital(index) {
    const estado = estados[index];
    map.setView([estado.coordenadas.lat, estado.coordenadas.lng], 10);
}

function irCapitalAnterior() {
    currentCapitalIndex = (currentCapitalIndex - 1 + estados.length) % estados.length;
    irACapital(currentCapitalIndex);
}

function irCapitalSiguiente() {
    currentCapitalIndex = (currentCapitalIndex + 1) % estados.length;
    irACapital(currentCapitalIndex);
}

const selectCapitales = document.getElementById('capitales');
estados.forEach((estado, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${estado.capital}`;
    selectCapitales.appendChild(option);
});

selectCapitales.addEventListener('change', (e) => {
    currentCapitalIndex = parseInt(e.target.value);
    irACapital(currentCapitalIndex);
});

estados.forEach(estado => {
    const marker = L.marker([estado.coordenadas.lat, estado.coordenadas.lng])
        .addTo(map)
        .bindPopup(`${estado.capital}`);

    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());
});

function actualizarMarcadores() {
    fetch('/ping')
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                const color = cliente.estado === 'conectado' ? 'green' : 'red';
                const marcador = L.circleMarker([cliente.coordenadas.lat, cliente.coordenadas.lng], { color: color }).addTo(map);
                marcador.bindPopup(`${cliente.nombreCliente}`);
            });
        });
}



// Actualizar marcadores cada 10 minutos
setInterval(actualizarMarcadores, 6000);
actualizarMarcadores();