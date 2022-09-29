import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

// função que vai lidar com as streams
async function buffer(readable: Readable) {
    const chucks = [];
    for await (const chunk of readable) {
        chucks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chucks);
}

export const config = {
    api: {
        bodyParser: false, // desabilita o formato padrão como o next recebe a requisição pois aqui estamos recebendo no formato de streams
    },
};

const relevantEvents = new Set([
    'checkout.session.completed', // usuário realiza o pagamento
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature'];
        let event: Stripe.Event;

        if (!secret) {
            return res.status(400).send(`Webhook error no secret`);
        }

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET as string);
        } catch (err: any) {
            return res.status(400).send(`Webhook error: ${err.message}`);
        }
        const { type } = event;

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(subscription.id, subscription.customer.toString() as string, false);
                        break;
                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session; // typamos pois o event é genérico, type especifico de checkout
                        await saveSubscription(
                            checkoutSession.subscription?.toString() as string,
                            checkoutSession.customer?.toString() as string,
                            true,
                        );
                        break;
                    default:
                        throw new Error('Unhandled event.');
                }
            } catch (err) {
                // aqui virando o sentry: rastreamento de erro
                return res.json({ error: 'Webhook handler failed.' }); // não retornar como um error pois isso vai para o stripe e ele vai ficar tentando, isso é um error de desenvolvimento pois o event type é relevante mas não foi tratado no switch
            }
        }
        return res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method not allowed');
    }
};
