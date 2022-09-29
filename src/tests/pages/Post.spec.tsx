import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');
const post = {
    slug: 'new-post',
    title: 'My new post',
    content: '<p>New Post</p>',
    updatedAt: 'March, 10',
};

jest.mock('next-auth/react');

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />);
        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('New Post')).toBeInTheDocument();
    });
    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = jest.mocked(getSession);
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null,
        } as any);

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post',
            },
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                }),
            }),
        );
    });
    it('loads initial data', async () => {
        const getSessionMocked = jest.mocked(getSession);
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
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription',
        } as any);
        const response = await getServerSideProps({
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
