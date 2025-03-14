import { query as dbQuery } from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const body = req.body;

  try {
    switch (method) {
      case 'POST': {
        if (body.method === 'GET') {
          const { table, query } = body.body;
          if (!table) {
            return res.status(400).json({ error: 'Table parameter is required' });
          }

          let sql = '';
          let params = [];

          switch (table) {
            case 'departamento':
              if (query) {
                sql = `
                  WITH departamento_info AS (
                    SELECT d.id_departamento, d.nombre_departamento, d.codigo_departamento
                    FROM departamento d
                    WHERE d.nombre_departamento ILIKE $1 OR d.codigo_departamento ILIKE $1
                  )
                  SELECT 
                    d.*,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_municipio', m.id_municipio,
                        'nombre_municipio', m.nombre_municipio,
                        'codigo_municipio', m.codigo_municipio
                      ) ORDER BY m.nombre_municipio
                    ) FILTER (WHERE m.id_municipio IS NOT NULL), '[]') as municipios
                  FROM departamento_info d
                  LEFT JOIN municipio m ON d.id_departamento = m.id_departamento
                  GROUP BY d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  ORDER BY d.nombre_departamento`;
                params = [`%${query}%`];
              } else {
                sql = `
                  SELECT 
                    d.*,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_municipio', m.id_municipio,
                        'nombre_municipio', m.nombre_municipio,
                        'codigo_municipio', m.codigo_municipio
                      ) ORDER BY m.nombre_municipio
                    ) FILTER (WHERE m.id_municipio IS NOT NULL), '[]') as municipios
                  FROM departamento d
                  LEFT JOIN municipio m ON d.id_departamento = m.id_departamento
                  GROUP BY d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  ORDER BY d.nombre_departamento`;
                params = [];
              }
              break;

            case 'municipio':
              if (query) {
                sql = `
                  WITH municipio_info AS (
                    SELECT m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                           d.id_departamento, d.nombre_departamento, d.codigo_departamento
                    FROM municipio m
                    JOIN departamento d ON m.id_departamento = d.id_departamento
                    WHERE m.nombre_municipio ILIKE $1 
                       OR m.codigo_municipio ILIKE $1
                       OR d.nombre_departamento ILIKE $1 
                       OR d.codigo_departamento ILIKE $1
                  )
                  SELECT 
                    m.*,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_colegio', c.id_colegio,
                        'nombre_colegio', c.nombre_colegio,
                        'codigo_colegio', c.codigo_colegio
                      ) ORDER BY c.nombre_colegio
                    ) FILTER (WHERE c.id_colegio IS NOT NULL), '[]') as colegios
                  FROM municipio_info m
                  LEFT JOIN colegio c ON m.id_municipio = c.id_municipio
                  GROUP BY m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                           m.id_departamento, m.nombre_departamento, m.codigo_departamento
                  ORDER BY m.nombre_municipio`;
                params = [`%${query}%`];
              } else {
                sql = `
                  SELECT 
                    m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                    d.id_departamento, d.nombre_departamento, d.codigo_departamento,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_colegio', c.id_colegio,
                        'nombre_colegio', c.nombre_colegio,
                        'codigo_colegio', c.codigo_colegio
                      ) ORDER BY c.nombre_colegio
                    ) FILTER (WHERE c.id_colegio IS NOT NULL), '[]') as colegios
                  FROM municipio m
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  LEFT JOIN colegio c ON m.id_municipio = c.id_municipio
                  GROUP BY m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                           d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  ORDER BY m.nombre_municipio`;
                params = [];
              }
              break;

            case 'colegio':
              if (query) {
                sql = `
                  WITH colegio_info AS (
                    SELECT c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                           m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                           d.id_departamento, d.nombre_departamento, d.codigo_departamento
                    FROM colegio c
                    JOIN municipio m ON c.id_municipio = m.id_municipio
                    JOIN departamento d ON m.id_departamento = d.id_departamento
                    WHERE c.nombre_colegio ILIKE $1 
                       OR c.codigo_colegio ILIKE $1
                       OR m.nombre_municipio ILIKE $1 
                       OR m.codigo_municipio ILIKE $1
                  )
                  SELECT 
                    c.*,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_sede', s.id_sede,
                        'nombre_sede', s.nombre_sede,
                        'codigo_sede', s.codigo_sede
                      ) ORDER BY s.nombre_sede
                    ) FILTER (WHERE s.id_sede IS NOT NULL), '[]') as sedes
                  FROM colegio_info c
                  LEFT JOIN sede s ON c.id_colegio = s.id_colegio
                  GROUP BY c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                           c.id_municipio, c.nombre_municipio, c.codigo_municipio,
                           c.id_departamento, c.nombre_departamento, c.codigo_departamento
                  ORDER BY c.nombre_colegio`;
                params = [`%${query}%`];
              } else {
                sql = `
                  SELECT 
                    c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                    m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                    d.id_departamento, d.nombre_departamento, d.codigo_departamento,
                    COALESCE(json_agg(
                      json_build_object(
                        'id_sede', s.id_sede,
                        'nombre_sede', s.nombre_sede,
                        'codigo_sede', s.codigo_sede
                      ) ORDER BY s.nombre_sede
                    ) FILTER (WHERE s.id_sede IS NOT NULL), '[]') as sedes
                  FROM colegio c
                  JOIN municipio m ON c.id_municipio = m.id_municipio
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  LEFT JOIN sede s ON c.id_colegio = s.id_colegio
                  GROUP BY c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                           m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                           d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  ORDER BY c.nombre_colegio`;
                params = [];
              }
              break;

            case 'sede':
              if (query) {
                sql = `
                  SELECT s.id_sede, s.nombre_sede, s.codigo_sede,
                         c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                         m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                         d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  FROM sede s
                  JOIN colegio c ON s.id_colegio = c.id_colegio
                  JOIN municipio m ON c.id_municipio = m.id_municipio
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  WHERE s.nombre_sede ILIKE $1 OR s.codigo_sede ILIKE $1
                  ORDER BY s.nombre_sede`;
                params = [`%${query}%`];
              } else {
                sql = `
                  SELECT s.id_sede, s.nombre_sede, s.codigo_sede,
                         c.id_colegio, c.nombre_colegio, c.codigo_colegio,
                         m.id_municipio, m.nombre_municipio, m.codigo_municipio,
                         d.id_departamento, d.nombre_departamento, d.codigo_departamento
                  FROM sede s
                  JOIN colegio c ON s.id_colegio = c.id_colegio
                  JOIN municipio m ON c.id_municipio = m.id_municipio
                  JOIN departamento d ON m.id_departamento = d.id_departamento
                  ORDER BY s.nombre_sede`;
                params = [];
              }
              break;

            default:
              return res.status(400).json({ error: 'Invalid table name' });
          }

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
          if (!data || !data.nombre || !data.codigo) {
            res.status(400).json({ error: 'Invalid request body: nombre and codigo are required' });
            return;
          }

          let sql = '';
          let params = [];

          switch (table) {
            case 'departamento':
              sql = `
                INSERT INTO departamento (nombre_departamento, codigo_departamento)
                VALUES ($1, $2)
                RETURNING *`;
              params = [data.nombre, data.codigo];
              break;

            case 'municipio':
              sql = `
                INSERT INTO municipio (nombre_municipio, codigo_municipio, id_departamento)
                VALUES ($1, $2, $3)
                RETURNING *`;
              params = [data.nombre, data.codigo, data.id_departamento];
              break;

            case 'colegio':
              sql = `
                WITH inserted_colegio AS (
                  INSERT INTO colegio (nombre_colegio, codigo_colegio, id_municipio)
                  VALUES ($1, $2, $3)
                  RETURNING id_colegio, nombre_colegio, codigo_colegio, id_municipio
                )
                SELECT 
                  c.*,
                  m.id_municipio,
                  m.nombre_municipio,
                  m.codigo_municipio,
                  d.id_departamento,
                  d.nombre_departamento,
                  d.codigo_departamento
                FROM inserted_colegio c
                JOIN municipio m ON c.id_municipio = m.id_municipio
                JOIN departamento d ON m.id_departamento = d.id_departamento`;
              params = [data.nombre, data.codigo, data.id_municipio];
              break;

            case 'sede':
              sql = `
                WITH inserted_sede AS (
                  INSERT INTO sede (nombre_sede, codigo_sede, id_colegio)
                  SELECT $1, $2, c.id_colegio
                  FROM colegio c
                  WHERE c.codigo_colegio = $3
                  RETURNING id_sede, nombre_sede, codigo_sede, id_colegio
                )
                SELECT 
                  s.*,
                  c.id_colegio,
                  c.nombre_colegio,
                  c.codigo_colegio,
                  m.id_municipio,
                  m.nombre_municipio,
                  m.codigo_municipio,
                  d.id_departamento,
                  d.nombre_departamento,
                  d.codigo_departamento
                FROM inserted_sede s
                JOIN colegio c ON s.id_colegio = c.id_colegio
                JOIN municipio m ON c.id_municipio = m.id_municipio
                JOIN departamento d ON m.id_departamento = d.id_departamento`;
              params = [data.nombre, data.codigo, data.codigo_colegio];
              break;
            default:
              return res.status(400).json({ error: 'Invalid table name' });
          }

          try {
            const result = await dbQuery(sql, params);
            res.status(201).json(result.rows[0]);
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: error.message });
          }
        } else if (body.method === 'PUT') {
          const { table, id, data } = body.body;
          try {
            const result = await dbQuery(`UPDATE ${table} SET nombre = $1 WHERE id = $2 RETURNING *`, [data.nombre, id]);
            res.status(200).json(result.rows[0]); 
          } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: error.message });
          }
        } else if (body.method === 'DELETE') {
          const { table, id } = body.body;
          
          let idColumn;
          switch (table) {
            case 'departamento':
              idColumn = 'id_departamento';
              break;
            case 'municipio':
              idColumn = 'id_municipio';
              break;
            case 'colegio':
              idColumn = 'id_colegio';
              break;
            case 'sede':
              idColumn = 'id_sede';
              break;
            default:
              return res.status(400).json({ error: 'Invalid table name' });
          }

          try {
            await dbQuery(`DELETE FROM ${table} WHERE ${idColumn} = $1`, [id]);
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
