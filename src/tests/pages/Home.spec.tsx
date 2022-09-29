import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages/index';
import { stripe } from '../../services/stripe';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

jest.mock('next-auth/react', () => {
    return {
        useSession() {
            return [null, false];
        },
    };
});
jest.mock('../../services/stripe');

describe('Home page', () => {
    it('renders correctly', () => {
        render(<Home product={{ priceId: 'fake-price-id', amount: '$10,00' }} />);
        expect(screen.getByText('for $10,00 mouth')).toBeInTheDocument();
    });
    it('loads initial data', async () => {
        const retrievePricesStripeMocked = jest.mocked(stripe.prices.retrieve);
        retrievePricesStripeMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any);

        const response = await getStaticProps({});
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id', // verifica se pelo menos o objeto tem essas informações
                        amount: 'R$\xa010,00',
                    },
                },
            }),
        );
    });
});
