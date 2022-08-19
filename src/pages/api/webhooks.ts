import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';

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

const relevantEvents = new Set(['checkout.session.completed']);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Event');
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature'];
        let event: Stripe.Event;

        if (!secret) {
            return res.status(400).send(`Webhook error no secret`);
        }

        try {
            const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
            event = stripe.webhooks.constructEvent(buf, secret, webhookSecret as string);
        } catch (err: any) {
            return res.status(400).send(`Webhook error: ${err.message}`);
        }
        const { type } = event;

        if (relevantEvents.has(type)) {
            console.log('Evento recebido', event);
        }
        return res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method not allowed');
    }
};
