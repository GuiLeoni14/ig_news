import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('SignInButton Component', () => {
    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: 'unauthenticated',
        });

        render(<SignInButton />);
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: {
                expires: '23423423',
                user: {
                    email: 'gui@gmail.com',
                    image: 'image.com.br',
                    name: 'Guilherme',
                },
            },
            status: 'authenticated',
        });
        render(<SignInButton />);
        expect(screen.getByText('Guilherme')).toBeInTheDocument();
    });
});
