import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';

// createAction: event de criação
export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
    try {
        // Buscar o usuário no banco do fauna, com o ID {costumerId}
        // Salvar os dados da subscription do usuário no fauna
        const userRef = await fauna.query(
            q.Select('ref', q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))), // pegar apenas a ref do campo, se quiser mais é so ir passando
        );

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const subscriptionData = {
            id: subscription.id,
            userId: userRef,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
        };

        if (createAction) {
            await fauna.query(q.Create(q.Collection('subscriptions'), { data: subscriptionData }));
        } else {
            // UPDATE atualiza apenas uma/umas informação e Replace atualiza tudo de uma vez
            await fauna.query(
                q.Replace(q.Select('ref', q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))), {
                    data: subscriptionData,
                }),
            );
        }
    } catch (error) {
        console.log(error);
    }
}
