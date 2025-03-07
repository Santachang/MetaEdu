import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const colegios = await db.any('SELECT * FROM Colegio');
            res.status(200).json(colegios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener colegios' });
        }
    } else if (req.method === 'POST') {
        const { nombre_colegio, codigo_colegio, id_municipio } = req.body;
        try {
            await db.none('INSERT INTO Colegio (nombre_colegio, codigo_colegio, id_municipio) VALUES ($1, $2, $3)', [nombre_colegio, codigo_colegio, id_municipio]);
            res.status(201).json({ message: 'Colegio creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear colegio' });
        }
    }
} 