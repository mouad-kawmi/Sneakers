import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartSidebar from './CartSidebar';
import cartReducer from '../../../store/slices/cartSlice';

const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                cart: cartReducer,
            },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>{children}</BrowserRouter>
        </Provider>
    );
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock ScrollToTop since it might be used by navigation
jest.mock('../../layout/ScrollToTop/ScrollToTop', () => () => null);

describe('CartSidebar Component', () => {
    test('renders nothing when closed', () => {
        renderWithProviders(<CartSidebar isOpen={false} onClose={() => { }} />);
        const title = screen.queryByText('Mon Panier');
        expect(title).not.toBeInTheDocument();
    });

    test('renders empty state when open and cart is empty', () => {
        renderWithProviders(<CartSidebar isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Votre panier est vide')).toBeInTheDocument();
        expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
    });

    test('renders cart items and summary when populated', () => {
        const preloadedState = {
            cart: {
                items: [
                    {
                        id: '1',
                        name: 'Test Shoe',
                        price: 500,
                        quantity: 2,
                        size: '42',
                        image: '/test.jpg',
                        totalPrice: 1000,
                    },
                ],
                totalQuantity: 2,
                totalAmount: 1000,
            },
        };

        renderWithProviders(<CartSidebar isOpen={true} onClose={() => { }} />, {
            preloadedState,
        });

        expect(screen.getByText('Test Shoe')).toBeInTheDocument();
        expect(screen.getByText('Taille: 42')).toBeInTheDocument();
        expect(screen.getByText('1000 DH')).toBeInTheDocument(); // Item total
        const prices = screen.getAllByText('1000.00 DH');
        expect(prices).toHaveLength(2); // Subtotal and Total
    });

    test('calls onClose when close button is clicked', () => {
        const handleClose = jest.fn();
        renderWithProviders(<CartSidebar isOpen={true} onClose={handleClose} />);

        const closeButton = screen.getByLabelText('Fermer le panier');
        fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
