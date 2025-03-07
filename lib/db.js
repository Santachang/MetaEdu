const pgp = require('pg-promise')();

const db = pgp({
    host: 'localhost', // Cambia esto si tu base de datos está en otro lugar
    port: 5432,
    database: 'metaedu',
    user: '<tu_usuario>',
    password: '<tu_contraseña>',
});

module.exports = db; 