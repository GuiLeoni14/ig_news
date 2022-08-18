import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

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
                        q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email))),
                    ),
                );
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    },
});
