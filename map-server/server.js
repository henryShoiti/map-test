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
    const { name, latitude, longitude, category } = req.body;
    const query = 'INSERT INTO locations (name, latitude, longitude, category) VALUES (?, ?, ?, ?)';
    db.query(query, [name, latitude, longitude, category], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json({ id: result.insertId, name, latitude, longitude, category });
        }
    });
});

app.post('/feedbacks', (req, res) => {
    const feedback = req.body.feedback;
    const sql = 'INSERT INTO feedbacks (feedback) VALUES (?)';

    db.query(sql, [feedback], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, feedback });
    });
});

app.get('/feedbacks', (req, res) => {
    const sql = 'SELECT * FROM feedbacks';

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
