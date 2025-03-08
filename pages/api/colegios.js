import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const colegios = await db.any(`
                SELECT 
                    c.id_colegio,
                    c.nombre_colegio,
                    c.codigo_colegio,
                    m.nombre_municipio,
                    d.nombre_departamento,
                    json_agg(
                        json_build_object(
                            'id_sede', s.id_sede,
                            'nombre_sede', s.nombre_sede,
                            'codigo_sede', s.codigo_sede
                        )
                    ) AS sedes
                FROM 
                    Colegio c
                JOIN 
                    Municipio m ON c.id_municipio = m.id_municipio
                JOIN 
                    Departamento d ON m.id_departamento = d.id_departamento
                LEFT JOIN 
                    Sede s ON c.id_colegio = s.id_colegio
                GROUP BY 
                    c.id_colegio, m.nombre_municipio, d.nombre_departamento
            `);
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