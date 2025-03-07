import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const municipios = await db.any('SELECT * FROM Municipio');
            res.status(200).json(municipios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener municipios' });
        }
    } else if (req.method === 'POST') {
        const { nombre_municipio, codigo_municipio, id_departamento } = req.body;
        try {
            await db.none('INSERT INTO Municipio (nombre_municipio, codigo_municipio, id_departamento) VALUES ($1, $2, $3)', [nombre_municipio, codigo_municipio, id_departamento]);
            res.status(201).json({ message: 'Municipio creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear municipio' });
        }
    }
} 