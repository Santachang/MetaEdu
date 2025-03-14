import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      backgroundColor: '#f8f9fa',
      overflowX: 'hidden',
      paddingBottom: '3rem'
    }}>
      <Navbar />
      <main style={{
        width: '100%',
        margin: '0',
        padding: '1rem',
        paddingTop: '5rem',
        color: '#333',
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '@media (min-width: 640px)': {
          padding: '5rem 2rem 2rem 2rem'
        }
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          paddingBottom: '2rem'
        }}>
          {/* Hero Section */}
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h1 style={{ 
              color: '#28a745', 
              marginBottom: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              Bienvenido a MetaEdu
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Tu plataforma integral para explorar el sistema educativo colombiano
            </p>
          </div>

          {/* Features Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ 
              color: '#28a745', 
              marginBottom: '1rem',
              fontSize: '1.75rem',
              fontWeight: '600'
            }}>¿Qué es MetaEdu?</h2>
            <p style={{ 
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#444'
            }}>
              MetaEdu es una plataforma educativa diseñada para facilitar la búsqueda y consulta de información sobre instituciones educativas en Colombia. 
              Nuestra base de datos incluye departamentos, municipios, colegios y sus respectivas sedes.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              color: '#28a745', 
              marginBottom: '1.5rem',
              fontSize: '1.75rem',
              fontWeight: '600'
            }}>Características</h2>
            <ul style={{ 
              display: 'grid',
              gap: '1rem',
              listStyle: 'none',
              padding: 0
            }}>
              {[
                'Búsqueda avanzada por nombre o código',
                'Información detallada de instituciones educativas',
                'Visualización de relaciones entre entidades',
                'Interfaz intuitiva y fácil de usar'
              ].map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1.1rem',
                  color: '#444',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  transition: 'transform 0.2s ease',
                  cursor: 'default',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <span style={{
                    color: '#28a745',
                    fontSize: '1.25rem'
                  }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{ 
              color: '#28a745', 
              marginBottom: '1rem',
              fontSize: '1.75rem',
              fontWeight: '600'
            }}>Desarrollador</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#28a745',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                JS
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '0.25rem'
                }}>
                  Jose Dhaniel Santamaria
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666'
                }}>
                  Desarrollador Full Stack
                </p>
              </div>
            </div>
            <p style={{ 
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#444'
            }}>
              Un estudiante apasionado por la tecnología y la educación. La plataforma fue creada con el objetivo de hacer más accesible la información educativa en Colombia.
            </p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <a href="https://adn-de-vs.vercel.app/" target="_blank" rel="noopener noreferrer">ADN DEVs</a>
        <span>|</span>
        <span>Desarrollado con ❤️ 2025</span>
      </footer>
    </div>
  );
}