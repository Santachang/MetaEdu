'use client';

import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function CRUD() {
    const [colegios, setColegios] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [searchType, setSearchType] = useState('colegio');
    const [searchValue, setSearchValue] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        fetchColegios();
        fetchSedes();
    }, []);

    const fetchColegios = async () => {
        const res = await fetch('/api/colegios');
        const data = await res.json();
        console.log("Colegios:", data);
        setColegios(data);
    };

    const fetchSedes = async () => {
        const res = await fetch('/api/sedes');
        const data = await res.json();
        console.log("Sedes:", data);
        setSedes(data);
    };

    const handleSearch = () => {
        if (searchValue.trim() === '') {
            setFilteredResults([]);
            setShowResults(false);
            return;
        }

        let results = [];
        if (searchType === 'colegio') {
            results = colegios.filter(colegio => 
                colegio.nombre_colegio.toLowerCase().includes(searchValue.toLowerCase()) ||
                colegio.codigo_colegio.toLowerCase() === searchValue.toLowerCase()
            );
        } else {
            results = sedes.filter(sede => 
                sede.nombre_sede.toLowerCase().includes(searchValue.toLowerCase()) ||
                sede.codigo_sede.toLowerCase() === searchValue.toLowerCase() ||
                (sede.nombre_colegio && sede.nombre_colegio.toLowerCase().includes(searchValue.toLowerCase()))
            );
        }
        console.log("Resultados filtrados:", results);
        setFilteredResults(results);
        setShowResults(true);
    };

    const closeModal = () => {
        setShowResults(false);
        setFilteredResults([]);
        setSearchValue('');
    };

    return (
        <div style={styles.container}>
            <h1>Buscar</h1>
            <div style={styles.form}>
                <select 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)} 
                    style={styles.select}
                >
                    <option value="colegio">Colegio</option>
                    <option value="sede">Sede</option>
                </select>
                <input
                    type="text"
                    placeholder={`Buscar por ${searchType === 'colegio' ? 'Nombre o Código de Colegio' : 'Nombre o Código de Sede'}`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleSearch} style={styles.button}>Buscar</button>
            </div>
            {showResults && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <span style={styles.close} onClick={closeModal}>&times;</span>
                        <h2 style={styles.modalTitle}>Resultados de Búsqueda</h2>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item) => (
                                <div key={item.id_colegio || item.id_sede} style={styles.resultItem}>
                                    {searchType === 'colegio' ? (
                                        <>
                                            <p><strong>Nombre del colegio:</strong> {item.nombre_colegio}</p>
                                            <p><strong>Código de colegio:</strong> {item.codigo_colegio}</p>
                                            <p><strong>Departamento:</strong> {item.nombre_departamento}</p>
                                            <p><strong>Municipio:</strong> {item.nombre_municipio}</p>
                                            <p><strong>Sedes:</strong></p>
                                            {item.sedes && item.sedes.length > 0 ? (
                                                <ul>
                                                    {item.sedes.map(sede => (
                                                        <li key={sede.id_sede}>
                                                            <strong>Nombre de sede:</strong> {sede.nombre_sede} - <strong>Código de sede:</strong> {sede.codigo_sede}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div>No hay sedes disponibles</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Nombre de la sede:</strong> {item.nombre_sede}</p>
                                            <p><strong>Código de la sede:</strong> {item.codigo_sede}</p>
                                            <p><strong>Departamento:</strong> {item.nombre_departamento}</p>
                                            <p><strong>Municipio:</strong> {item.nombre_municipio}</p>
                                            <p><strong>Colegio al que pertenece:</strong> {item.nombre_colegio}</p>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron resultados.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    select: {
        padding: '8px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    input: {
        padding: '8px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '200px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    modal: {
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: '15% auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        borderRadius: '4px',
        textAlign: 'left',
    },
    close: {
        color: 'black',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    modalTitle: {
        textAlign: 'center',
        color: '#333',
    },
    resultItem: {
        marginBottom: '20px',
    },
};