import { useState } from 'react';
import db from '../lib/db';

export default function Municipios() {
    const [municipio, setMunicipio] = useState('');
    const [codigoMunicipio, setCodigoMunicipio] = useState('');
    const [colegio, setColegio] = useState('');
    const [codigoColegio, setCodigoColegio] = useState('');

    const handleAddMunicipio = async (e) => {
        e.preventDefault();
        try {
            await db.none('INSERT INTO municipios(nombre, codigo) VALUES($1, $2)', [municipio, codigoMunicipio]);
            alert('Municipio agregado exitosamente');
            setMunicipio('');
            setCodigoMunicipio('');
        } catch (error) {
            console.error('Error al agregar municipio:', error);
        }
    };

    const handleAddColegio = async (e) => {
        e.preventDefault();
        try {
            await db.none('INSERT INTO colegios(nombre, codigo, municipio_id) VALUES($1, $2, (SELECT id FROM municipios WHERE codigo = $3))', [colegio, codigoColegio, codigoMunicipio]);
            alert('Colegio agregado exitosamente');
            setColegio('');
            setCodigoColegio('');
        } catch (error) {
            console.error('Error al agregar colegio:', error);
        }
    };

    return (
        <div>
            <h1>Cargar Municipios y Colegios</h1>
            <form onSubmit={handleAddMunicipio}>
                <h2>Agregar Municipio</h2>
                <input
                    type="text"
                    placeholder="Nombre del Municipio"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Código del Municipio"
                    value={codigoMunicipio}
                    onChange={(e) => setCodigoMunicipio(e.target.value)}
                    required
                />
                <button type="submit">Agregar Municipio</button>
            </form>

            <form onSubmit={handleAddColegio}>
                <h2>Agregar Colegio</h2>
                <input
                    type="text"
                    placeholder="Nombre del Colegio"
                    value={colegio}
                    onChange={(e) => setColegio(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Código del Colegio"
                    value={codigoColegio}
                    onChange={(e) => setCodigoColegio(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Código del Municipio"
                    value={codigoMunicipio}
                    onChange={(e) => setCodigoMunicipio(e.target.value)}
                    required
                />
                <button type="submit">Agregar Colegio</button>
            </form>
        </div>
    );
} 