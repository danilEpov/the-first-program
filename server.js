const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const secretKey = 'your_secret_key';

// Middleware для обработки данных в формате JSON
app.use(bodyParser.json());

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Маршрут для страницы "О нас"
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

// Маршрут для формы
app.get('/regist', (req, res) => {
    res.sendFile(__dirname + '/public/regist.html');
});
app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Маршрут для обработки данных формы (POST запрос)
app.post('/regist', async (req, res) => {
    const { login, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (login, password) VALUES(?,?)';
    db.query(query, [login, hashedPassword], (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса: ' + err.stack);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json({ message: 'Успешно зарегистрированы!' });
    });
});
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    const query = 'SELECT * FROM users WHERE login = ?';
    db.query(query, [login], async (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса: ' + err.stack);
            res.status(500).send('Ошибка сервера');
            return;
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Неверный логин или пароль' });
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Неверный логин или пароль' });
        }
        const token = jwt.sign({ login: user.login }, secretKey, { expiresIn: '1h' });
        res.redirect('/main');
    });
});

// Обработка статических файлов
app.use(express.static('public'));

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});