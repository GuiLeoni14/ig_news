import Head from 'next/head';
import Link from 'next/link';
import styles from './styles.module.scss';

export default function PagePosts() {
    return (
        <>
            <Head>
                <title>Posts - IgNews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <Link href="#">
                        <a>
                            <time>12 de março de 2821</time>
                            <strong>Titulo do posts</strong>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero aperiam explicabo
                                obcaecati voluptatem consequatur, beatae cum consequuntur accusantium.
                            </p>
                        </a>
                    </Link>
                    <Link href="#">
                        <a>
                            <time>12 de março de 2821</time>
                            <strong>Titulo do posts</strong>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero aperiam explicabo
                                obcaecati voluptatem consequatur, beatae cum consequuntur accusantium.
                            </p>
                        </a>
                    </Link>
                    <Link href="#">
                        <a>
                            <time>12 de março de 2821</time>
                            <strong>Titulo do posts</strong>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero aperiam explicabo
                                obcaecati voluptatem consequatur, beatae cum consequuntur accusantium.
                            </p>
                        </a>
                    </Link>
                    <Link href="#">
                        <a>
                            <time>12 de março de 2821</time>
                            <strong>Titulo do posts</strong>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero aperiam explicabo
                                obcaecati voluptatem consequatur, beatae cum consequuntur accusantium.
                            </p>
                        </a>
                    </Link>
                    <Link href="#">
                        <a>
                            <time>12 de março de 2821</time>
                            <strong>Titulo do posts</strong>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero aperiam explicabo
                                obcaecati voluptatem consequatur, beatae cum consequuntur accusantium.
                            </p>
                        </a>
                    </Link>
                </div>
            </main>
        </>
    );
}
