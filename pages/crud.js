'use client';

import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function CRUD() {
    const [colegios, setColegios] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [searchColegio, setSearchColegio] = useState('');
    const [searchColegioCodigo, setSearchColegioCodigo] = useState('');
    const [searchSede, setSearchSede] = useState('');
    const [searchSedeCodigo, setSearchSedeCodigo] = useState('');
    const [filteredColegios, setFilteredColegios] = useState([]);
    const [filteredSedes, setFilteredSedes] = useState([]);

    useEffect(() => {
        fetchColegios();
        fetchSedes();
    }, []);

    const fetchColegios = async () => {
        const res = await fetch('/api/colegios');
        const data = await res.json();
        setColegios(data);
    };

    const fetchSedes = async () => {
        const res = await fetch('/api/sedes');
        const data = await res.json();
        setSedes(data);
    };

    const handleSearchColegio = () => {
        const results = colegios.filter(colegio => {
            const matchesName = colegio.nombre_colegio.toLowerCase() === searchColegio.toLowerCase();
            const matchesCode = colegio.codigo_colegio.toLowerCase() === searchColegioCodigo.toLowerCase();
            return matchesName || matchesCode;
        });
        setFilteredColegios(results);
    };

    const handleSearchSede = () => {
        const results = sedes.filter(sede => {
            const matchesName = sede.nombre_sede.toLowerCase() === searchSede.toLowerCase();
            const matchesCode = sede.codigo_sede.toLowerCase() === searchSedeCodigo.toLowerCase();
            return matchesName || matchesCode;
        });
        setFilteredSedes(results);
    };

    return (
        <div>
            <h1>Buscar Colegios y Sedes</h1>

            <h2>Buscar Colegio</h2>
            <input
                type="text"
                placeholder="Buscar por Nombre"
                value={searchColegio}
                onChange={(e) => setSearchColegio(e.target.value)}
            />
            <input
                type="text"
                placeholder="Buscar por Código"
                value={searchColegioCodigo}
                onChange={(e) => setSearchColegioCodigo(e.target.value)}
            />
            <button onClick={handleSearchColegio}>Buscar</button>
            <ul>
                {filteredColegios.length > 0 ? (
                    filteredColegios.map((colegio) => {
                        const sedesDeColegio = sedes.filter(sede => sede.id_colegio === colegio.id_colegio);
                        return (
                            <li key={colegio.id_colegio}>
                                {colegio.nombre_colegio} - {colegio.codigo_colegio}
                                {sedesDeColegio.length > 0 && (
                                    <ul>
                                        {sedesDeColegio.map(sede => (
                                            <li key={sede.id_sede}>{sede.nombre_sede} - {sede.codigo_sede}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <li>No se encontraron colegios.</li>
                )}
            </ul>

            <h2>Buscar Sede</h2>
            <input
                type="text"
                placeholder="Buscar por Nombre"
                value={searchSede}
                onChange={(e) => setSearchSede(e.target.value)}
            />
            <input
                type="text"
                placeholder="Buscar por Código"
                value={searchSedeCodigo}
                onChange={(e) => setSearchSedeCodigo(e.target.value)}
            />
            <button onClick={handleSearchSede}>Buscar</button>
            <ul>
                {filteredSedes.length > 0 ? (
                    filteredSedes.map((sede) => {
                        const colegio = colegios.find(c => c.id_colegio === sede.id_colegio);
                        return (
                            <li key={sede.id_sede}>
                                {sede.nombre_sede} - {sede.codigo_sede}
                                {colegio && <span> (Colegio: {colegio.nombre_colegio})</span>}
                            </li>
                        );
                    })
                ) : (
                    <li>No se encontraron sedes.</li>
                )}
            </ul>
        </div>
    );
} 