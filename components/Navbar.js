import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isCurrentPath = (path) => router.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#28a745',
      padding: '0.75rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Link href="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            backgroundColor: 'white',
            color: '#28a745',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>M</span>
          MetaEdu
        </Link>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            padding: '0.5rem',
            cursor: 'pointer',
            '@media (max-width: 640px)': {
              display: 'block'
            }
          }}
        >
          ☰
        </button>

        <div style={{
          display: isMenuOpen ? 'flex' : 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
          '@media (max-width: 640px)': {
            display: isMenuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
            marginTop: '1rem'
          }
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            position: 'relative',
            transition: 'all 0.3s ease',
            backgroundColor: isCurrentPath('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: isCurrentPath('/') ? '10%' : '50%',
              width: isCurrentPath('/') ? '80%' : '0%',
              height: '2px',
              backgroundColor: 'white',
              transition: 'all 0.3s ease'
            },
            '&:hover:after': {
              left: '10%',
              width: '80%'
            }
          }}>
            Inicio
          </Link>
          <Link href="/crud" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            position: 'relative',
            transition: 'all 0.3s ease',
            backgroundColor: isCurrentPath('/crud') ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: isCurrentPath('/crud') ? '10%' : '50%',
              width: isCurrentPath('/crud') ? '80%' : '0%',
              height: '2px',
              backgroundColor: 'white',
              transition: 'all 0.3s ease'
            },
            '&:hover:after': {
              left: '10%',
              width: '80%'
            }
          }}>
            Colegios
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
