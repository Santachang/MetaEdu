import { Metadata } from 'next';
import styles from '../styles/Home.module.css';
import CRUD from '../pages/crud';

export const metadata: Metadata = {
    title: 'MetaEdu',
    description: 'Gestión de instituciones educativas en el Departamento del Meta',
};

export default function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Bienvenido a MetaEdu</h1>
                <p>Gestión de instituciones educativas en el Departamento del Meta.</p>
                <CRUD />
            </main>
        </div>
    );
} 