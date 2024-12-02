const express = require('express');
const bodyParser = require('body-parser');
const ping = require('ping');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

let clients = require('./ClienteNodos.json');

const pingClients = async () => {
    const results = await Promise.all(clients.map(async (client) => {
        const isAlive = await ping.promise.probe(client.direccion);
        return {
            ...client,
            conectado: isAlive.alive
        };
    }));

    fs.writeFileSync('Pingnodos.json', JSON.stringify(results, null, 2));

    return results;
};

const startPinging = () => {
    pingClients();
    setInterval(() => {
        pingClients();
    }, 15 * 60 * 1000); // Ping cada 15 minutos
};

app.get('/ping-clients', async (req, res) => {
    const results = await pingClients();
    res.json(results);
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(5001, () => {
    console.log('Servidor corriendo en el puerto 5001');
    startPinging();
    setTimeout(() => {
        console.log('Actualizando mapa...');
        pingClients();
    }, 5 * 60 * 1000); // Actualizar mapa 5 minutos después de realizar ping
});
