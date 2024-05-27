const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'mapdb'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

app.get('/locations', (req, res) => {
    db.query('SELECT * FROM locations', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/locations', (req, res) => {
    const { name, latitude, longitude } = req.body;
    const query = 'INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)';
    db.query(query, [name, latitude, longitude], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json({ id: result.insertId, name, latitude, longitude });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});