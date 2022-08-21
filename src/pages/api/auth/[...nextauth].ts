import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { Casefold, query as q } from 'faunadb';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            authorization: { params: { scope: 'read:user' } },
        }),
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            const { email } = user;
            try {
                await fauna.query(
                    q.If(
                        q.Not(q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(user.email as string)))),
                        q.Create(q.Collection('users'), {
                            data: { email },
                        }),
                        q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email as string))),
                    ),
                );
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async session({ session }) {
            let userActiveSubscription = null;
            if (session && session.user && session.user.email) {
                console.log(session.user.email);
                try {
                    userActiveSubscription = await fauna.query(
                        q.Get(
                            q.Intersection([
                                q.Match(
                                    q.Index('subscription_by_user_ref'),
                                    q.Select(
                                        'ref',
                                        q.Get(
                                            q.Match(q.Index('user_by_email'), q.Casefold(session.user.email as string)),
                                        ),
                                    ),
                                ),
                                q.Match(q.Index('subscription_by_status'), Casefold('active')),
                            ]),
                        ),
                    );
                } catch (error) {
                    console.log(error);
                    userActiveSubscription = null;
                }
            }
            return {
                ...session,
                activeSubscription: userActiveSubscription,
            };
        },
    },
});
