import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';

export default function Home() {
    return (
        <>
            <Head>
                <title>Ig News | Home</title>
            </Head>
            <main className={styles.contentContainer}>
                <section className={styles.hero}>
                    <span>👏 Hey, welcome</span>
                    <h1>
                        News about the <span>React</span> world.
                    </h1>
                    <p>
                        Get access to all publications <br />
                        <span>for $9.99 mouth</span>
                    </p>
                    <SubscribeButton />
                </section>
                <img src="/images/avatar.svg" alt="girl coding" />
            </main>
        </>
    );
}
