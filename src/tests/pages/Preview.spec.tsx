import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');
jest.mock('next-auth/react');
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

const post = {
    slug: 'new-post',
    title: 'My new post',
    content: '<p>New Post</p>',
    updatedAt: 'March, 10',
};

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated',
        });

        render(<Post post={post} />);

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('New Post')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });
    it('redirects user if to full post when user is subscribed', async () => {
        const useSessionMocked = jest.mocked(useSession);
        const useRouterMocked = jest.mocked(useRouter);
        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: {
                activeSubscription: 'fake-active-subscription',
            },
        } as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked,
            query: {
                slug: 'new-post',
            },
        } as any);
        render(<Post post={post} />);
        expect(pushMocked).toHaveBeenCalledWith({ pathname: '/posts/new-post' });
    });
    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {
                            type: 'heading1',
                            text: 'Fake title 1',
                        },
                    ],
                    content: [
                        {
                            type: 'paragraph',
                            text: 'Fake excerpt 1',
                        },
                    ],
                },
                last_publication_date: '01-01-2020',
            }),
        } as any);
        const response = await getStaticProps({
            params: {
                slug: 'my-new-post',
            },
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'Fake title 1',
                        content: '<p>Fake excerpt 1</p>',
                        updatedAt: '01 de janeiro de 2020',
                    },
                },
            }),
        );
    });
});
