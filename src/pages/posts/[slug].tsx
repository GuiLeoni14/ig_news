import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

interface PagePostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    };
}
export default function PagePost({ post }: PagePostProps) {
    const tilePage = `${post.title} | IgNews`;
    return (
        <>
            <Head>
                <title>{tilePage}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = getSession({ req: ctx.req });
    const prismic = getPrismicClient({
        previewData: ctx.previewData,
    });
    const { slug } = ctx.params!;
    const response = await prismic.getByUID('publicar', slug as string);
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }),
    };
    return {
        props: { post },
    };
};
