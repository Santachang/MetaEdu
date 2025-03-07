import pgPromise from 'pg-promise';

const pgp = pgPromise();

// Configuración de la conexión a la base de datos
const connectionString = {
    host: 'localhost', // Cambia esto si tu base de datos está en otro lugar
    port: 5432,
    database: 'metaedu',
    user: 'postgres',
    password: 'Basedatos270810',
};

// Crear una única instancia de la conexión
const db = pgp(connectionString);

export default db; 