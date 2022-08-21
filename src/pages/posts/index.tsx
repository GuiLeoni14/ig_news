import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import styles from './styles.module.scss';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
};
interface PagePostsProps {
    posts: Post[];
}
export default function PagePosts({ posts }: PagePostsProps) {
    return (
        <>
            <Head>
                <title>Posts - IgNews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map((post) => {
                        return (
                            <Link href={`/posts/${post.slug}`} key={post.slug}>
                                <a>
                                    <time>{post.updatedAt}</time>
                                    <strong>{post.title}</strong>
                                    <p>{post.excerpt}</p>
                                </a>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
    const prismic = getPrismicClient({
        previewData: ctx.previewData,
    });
    const response = await prismic.getAllByType('publicar', {
        fetch: ['publicar.title', 'publicar.content'],
        pageSize: 100,
    });

    const posts = response.map((post) => {
        // excerpt: percorrer todos os content e pegar o primeiro onde o tipo e paragrafo
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        };
    });
    console.log('response', JSON.stringify(response, null, 2));
    return {
        props: { posts },
    };
};
