import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

export type TPageHomeProps = {
    product: {
        priceId: string;
        amount: string | null;
    };
};

export default function PageHome({ product }: TPageHomeProps) {
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
                        <span>for {product.amount} mouth</span>
                    </p>
                    <SubscribeButton priceId={product.priceId} />
                </section>
                <img src="/images/avatar.svg" alt="girl coding" />
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps<TPageHomeProps> = async () => {
    // retrieve apenas um elemento
    // expand retorna todas as informações do produto por default retorna apenas o id do produto ligado ao preço
    const price = await stripe.prices.retrieve('price_1LXwcyCWf3dovHWdvf6kvYWY', {
        expand: ['product'],
    });
    const product = {
        priceId: price.id,
        amount: price.unit_amount
            ? new Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
              }).format(price.unit_amount / 100) // product vem em centavos pro isso dividimos pro cem
            : null,
    };
    return {
        props: {
            product,
        },
        revalidate: 60 * 60 * 24, // 24 hors 60s, 60min, 24hrs
    };
};
