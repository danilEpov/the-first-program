const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Хост базы данных
  user: 'root', // Имя пользователя базы данных
  password: 'Danilepov2015!', // Пароль пользователя базы данных
  database: 'main' // Имя базы данных
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения: ' + err.stack);
    return;
  }
  console.log('Подключено к базе данных как id ' + connection.threadId);
});

module.exports = connection;