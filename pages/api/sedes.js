import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const sedes = await db.any(`
                SELECT 
                    s.id_sede,
                    s.nombre_sede,
                    s.codigo_sede,
                    c.nombre_colegio,
                    m.nombre_municipio,
                    d.nombre_departamento
                FROM 
                    Sede s
                JOIN 
                    Colegio c ON s.id_colegio = c.id_colegio
                JOIN 
                    Municipio m ON c.id_municipio = m.id_municipio
                JOIN 
                    Departamento d ON m.id_departamento = d.id_departamento
            `);
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