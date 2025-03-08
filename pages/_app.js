import '../styles/globals.css'; // Importar el archivo de estilos globales
import Navbar from '../components/Navbar'; // Importar el componente Navbar

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp; 