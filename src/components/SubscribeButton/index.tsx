import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return;
        }
        if (session.activeSubscription) {
            return router.push({
                pathname: '/posts',
            });
        }
        try {
            const response = await api.post('/subscribe');
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            if (stripe) {
                await stripe.redirectToCheckout({
                    sessionId: sessionId,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscriber now
        </button>
    );
}
