import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    console.log(priceId);
    const { data: session } = useSession();
    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return;
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
