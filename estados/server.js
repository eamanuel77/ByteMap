const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/ping', (req, res) => {
    const clientes = JSON.parse(fs.readFileSync('clientes.json', 'utf8'));
    const resultados = [];

    clientes.forEach(cliente => {
        axios.get(`http://${cliente.direccion}`)
            .then(response => {
                resultados.push({ ...cliente, estado: 'conectado' });
            })
            .catch(error => {
                resultados.push({ ...cliente, estado: 'desconectado' });
            });
    });

    setTimeout(() => {
        fs.writeFileSync('Pingnodos.json', JSON.stringify(resultados, null, 2));
        res.send(resultados);
    }, 5000); // espera a que todos los pings terminen
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
