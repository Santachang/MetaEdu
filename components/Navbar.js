'use client';

import Link from 'next/link';
import { useState } from 'react';
import '../styles/globals.css'; // Asegúrate de que los estilos globales estén importados

export default function Navbar() {
    const [hoveredLink, setHoveredLink] = useState(null);

    return (
        <nav style={styles.navbar}>
            <Link 
                href="/" 
                style={{ ...styles.link, backgroundColor: hoveredLink === 'home' ? '#e0e0e0' : 'transparent' }}
                onMouseEnter={() => setHoveredLink('home')}
                onMouseLeave={() => setHoveredLink(null)}
            >
                Home
            </Link>
            <Link 
                href="/crud" 
                style={{ ...styles.link, backgroundColor: hoveredLink === 'colegios' ? '#e0e0e0' : 'transparent' }}
                onMouseEnter={() => setHoveredLink('colegios')}
                onMouseLeave={() => setHoveredLink(null)}
            >
                Colegios
            </Link>
        </nav>
    );
}

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '5px 20px',
        color: 'black',
        position: 'absolute',
        top: '10px',
        right: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    link: {
        color: 'black',
        textDecoration: 'none',
        fontSize: '14px',
        marginRight: '15px',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
}; 