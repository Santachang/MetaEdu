import { query as dbQuery } from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const body = req.body;

  try {
    switch (method) {
      case 'POST': {
        if (body.method === 'GET') {
          const { table, query } = body.body;
          if (!table || !query) {
            return res.status(400).json({ error: 'Table and query parameters are required' });
          }

          let sql = '';
          let params = [];

          switch (table) {
            case 'departamento':
              sql = `
                WITH departamento_info AS (
                  SELECT d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  FROM departamento d
                  WHERE d.nombre_departamento ILIKE $1 OR d.codigo_departamento ILIKE $1
                ),
                municipios_del_departamento AS (
                  SELECT m.id_municipio, m.nombre_municipio, m.codigo_municipio, d.id_departamento
                  FROM municipio m
                  JOIN departamento_info d ON m.id_departamento = d.id_departamento
                )
                SELECT 
                  d.*,
                  json_agg(json_build_object(
                    'id_municipio', m.id_municipio,
                    'nombre_municipio', m.nombre_municipio,
                    'codigo_municipio', m.codigo_municipio
                  )) as municipios
                FROM departamento_info d
                LEFT JOIN municipios_del_departamento m ON d.id_departamento = m.id_departamento
                GROUP BY d.id_departamento, d.nombre_departamento, d.codigo_departamento`;
              break;

            case 'municipio':
              sql = `
                WITH municipio_info AS (
                  SELECT m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                         d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  FROM municipio m
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  WHERE m.nombre_municipio ILIKE $1 OR m.codigo_municipio ILIKE $1
                ),
                colegios_del_municipio AS (
                  SELECT c.id_colegio, c.nombre_colegio, c.codigo_colegio, m.id_municipio
                  FROM colegio c
                  JOIN municipio_info m ON c.id_municipio = m.id_municipio
                )
                SELECT 
                  m.*,
                  json_agg(json_build_object(
                    'id_colegio', c.id_colegio,
                    'nombre_colegio', c.nombre_colegio,
                    'codigo_colegio', c.codigo_colegio
                  )) as colegios
                FROM municipio_info m
                LEFT JOIN colegios_del_municipio c ON m.id_municipio = c.id_municipio
                GROUP BY m.id_municipio, m.nombre_municipio, m.codigo_municipio, 
                         m.id_departamento, m.nombre_departamento, m.codigo_departamento`;
              break;

            case 'colegio':
              sql = `
                WITH colegio_info AS (
                  SELECT c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                         m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                         d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  FROM colegio c
                  JOIN municipio m ON c.id_municipio = m.id_municipio
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  WHERE c.nombre_colegio ILIKE $1 OR c.codigo_colegio ILIKE $1
                ),
                sedes_del_colegio AS (
                  SELECT s.id_sede, s.nombre_sede, s.codigo_sede, c.id_colegio
                  FROM sede s
                  JOIN colegio_info c ON s.id_colegio = c.id_colegio
                )
                SELECT 
                  c.*,
                  json_agg(json_build_object(
                    'id_sede', s.id_sede,
                    'nombre_sede', s.nombre_sede,
                    'codigo_sede', s.codigo_sede
                  )) as sedes
                FROM colegio_info c
                LEFT JOIN sedes_del_colegio s ON c.id_colegio = s.id_colegio
                GROUP BY c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                         c.id_municipio, c.nombre_municipio, c.codigo_municipio,
                         c.id_departamento, c.nombre_departamento, c.codigo_departamento`;
              break;

            case 'sede':
              sql = `
                SELECT s.id_sede, s.nombre_sede, s.codigo_sede,
                       c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                       m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                       d.id_departamento, d.nombre_departamento, d.codigo_departamento
                FROM sede s
                JOIN colegio c ON s.id_colegio = c.id_colegio
                JOIN municipio m ON c.id_municipio = m.id_municipio
                JOIN departamento d ON m.id_departamento = d.id_departamento
                WHERE s.nombre_sede ILIKE $1 OR s.codigo_sede ILIKE $1`;
              break;

            default:
              return res.status(400).json({ error: 'Invalid table name' });
          }

          params.push(`%${query}%`);

          try {
            console.log('Executing SQL:', sql, 'with params:', params);
            const result = await dbQuery(sql, params);
            console.log('Query result:', result);
            return res.status(200).json(result.rows);
          } catch (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: error.message });
          }
        } else if (body.method === 'POST') {
          const { table, data } = body.body;
          if (!data || !data.name) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
          }

          try {
            const result = await dbQuery(`INSERT INTO ${table} (name) VALUES ($1) RETURNING *`, [data.name]);
            res.status(201).json(result.rows[0]);
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: error.message });
          }
        } else if (body.method === 'PUT') {
          const { table, id, data } = body.body;
          try {
            const result = await dbQuery(`UPDATE ${table} SET name = $1 WHERE id = $2 RETURNING *`, [data.name, id]);
            res.status(200).json(result.rows[0]); 
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: error.message });
          }
        } else if (body.method === 'DELETE') {
          const { table, id } = body.body;
          try {
            await dbQuery(`DELETE FROM ${table} WHERE id = $1`, [id]);
            res.status(204).end();
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: error.message });
          }
        }
        break;
      }
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: error.message });
  }
}
