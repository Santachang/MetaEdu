const db = require('./db');

async function testConnection() {
    console.log('Iniciando prueba de conexión...'); // Mensaje de inicio
    try {
        const result = await db.any('SELECT NOW()'); // Ejecuta una consulta simple
        console.log('Conexión exitosa a la base de datos:', result);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    } finally {
        console.log('Prueba de conexión finalizada.'); // Mensaje final
    }
}

testConnection(); 