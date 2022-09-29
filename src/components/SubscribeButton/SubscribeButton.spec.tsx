import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { SubscribeButton } from '.';
import { useRouter } from 'next/router';
jest.mock('next-auth/react');

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

describe('SubscribeButton Component', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated',
        });
        render(<SubscribeButton />);
        expect(screen.getByText('Subscriber now')).toBeInTheDocument();
    });

    it('redirects user to sing in when not authenticated', () => {
        const signInMocked = jest.mocked(signIn);
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated',
        });

        render(<SubscribeButton />);

        const subscriberButton = screen.getByText('Subscriber now');

        fireEvent.click(subscriberButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts where user already has a subscription', () => {
        const useRouterMocked = jest.mocked(useRouter);

        const useSessionMocked = jest.mocked(useSession);

        const pushMocked = jest.fn();
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@exemple.com',
                },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires',
            },
        } as any);
        useRouterMocked.mockReturnValueOnce({
            push: pushMocked,
        } as any);

        render(<SubscribeButton />);
        const subscriberButton = screen.getByText('Subscriber now');

        fireEvent.click(subscriberButton);

        expect(pushMocked).toHaveBeenCalledWith({ pathname: '/posts' });
    });
});
