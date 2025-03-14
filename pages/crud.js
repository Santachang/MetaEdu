// pages/crud.js
import Navbar from '../components/Navbar';
import CRUDOperations from '../components/CRUDOperations';

export default function CRUD() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      paddingBottom: '3rem'
    }}>
      <Navbar />
      <div style={{
        width: '100%',
        paddingTop: '3.5rem',
        flex: 1
      }}>
        <CRUDOperations />
      </div>
      <footer className="footer">
        <a href="https://adn-de-vs.vercel.app/" target="_blank" rel="noopener noreferrer">ADN DEVs</a>
        <span>|</span>
        <span>Desarrollado con ❤️ 2025</span>
      </footer>
    </div>
  );
}