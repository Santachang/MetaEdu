import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const sedes = await db.any('SELECT * FROM Sede');
            res.status(200).json(sedes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener sedes' });
        }
    } else if (req.method === 'POST') {
        const { nombre_sede, codigo_sede, id_colegio } = req.body;
        try {
            await db.none('INSERT INTO Sede (nombre_sede, codigo_sede, id_colegio) VALUES ($1, $2, $3)', [nombre_sede, codigo_sede, id_colegio]);
            res.status(201).json({ message: 'Sede creada' });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear sede' });
        }
    }
} 