'use client';

import Link from 'next/link';
import '../styles/globals.css'; // Asegúrate de que los estilos globales estén importados

export default function Home() {
    return (
        <div style={styles.container}>
            <h1>Bienvenido a MetaEdu</h1>
            <p>Esta es la página de inicio de la aplicación para gestionar instituciones educativas.</p>
            <Link href="/crud">
                <button style={styles.button}>Ir a Colegios</button>
            </Link>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Centrar verticalmente
        textAlign: 'center',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#0056b3', // Color azul
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
}; 