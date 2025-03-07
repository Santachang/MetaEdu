import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>MetaEdu</title>
                <meta name="description" content="Gestión de instituciones educativas en el Departamento del Meta" />
            </Head>
            <main className={styles.main}>
                <h1>Bienvenido a MetaEdu</h1>
                <p>Gestión de instituciones educativas en el Departamento del Meta.</p>
            </main>
        </div>
    );
} 