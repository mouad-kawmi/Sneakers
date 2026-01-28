import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Checkout from './Checkout';
import cartReducer from '../../store/slices/cartSlice';
import authReducer from '../../store/slices/authSlice';
import ordersReducer from '../../store/slices/ordersSlice';
import productReducer from '../../store/slices/productSlice';
import { ToastProvider } from '../../context/ToastContext';

// Helper to render with Redux and Router
const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                cart: cartReducer,
                auth: authReducer,
                orders: ordersReducer,
                products: productReducer
            },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>
                <ToastProvider>{children}</ToastProvider>
            </BrowserRouter>
        </Provider>
    );
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock ScrollToTop since it uses window.scrollTo
window.scrollTo = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock generateOrderPdf service
jest.mock('../../services/PdfService', () => ({
    generateOrderPdf: jest.fn(),
}));

describe('Checkout Page', () => {

    test('redirects to home if cart is empty', () => {
        renderWithProviders(<Checkout />);
        // Should call navigate to home
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('renders checkout form when cart has items', () => {
        const preloadedState = {
            cart: {
                items: [{ id: 1, name: 'Test Product', price: 100, quantity: 1, size: '42' }],
                totalAmount: 100,
                totalQuantity: 1
            }
        };

        renderWithProviders(<Checkout />, { preloadedState });

        // Should NOT redirect
        expect(mockNavigate).not.toHaveBeenCalledWith('/');

        expect(screen.getByText('Informations de Livraison')).toBeInTheDocument();
        expect(screen.getByText('Résumé de la commande')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    test('validates form inputs', async () => {
        const preloadedState = {
            cart: {
                items: [{ id: 1, name: 'Test Product', price: 100, quantity: 1, size: '42' }],
                totalAmount: 100
            }
        };
        renderWithProviders(<Checkout />, { preloadedState });

        const submitBtn = screen.getByText('Confirmer la commande');
        fireEvent.click(submitBtn);

        // Should show validation errors
        // Note: The component sets local state errors which might not render separate text elements 
        // unless specifically designed, but looking at the code: 
        // {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        // So we can expect "Requis" or similar text.

        // Using waitFor because state updates are async
        await waitFor(() => {
            // Since we didn't fill anything, "Requis" should appear multiple times.
            // We can check for specific error messages or class names.
            // Let's check for one specific error message
            const errorMessages = screen.getAllByText('Requis');
            expect(errorMessages.length).toBeGreaterThan(0);
        });
    });

    test('fills form with user details if logged in', () => {
        const preloadedState = {
            cart: { items: [{ id: 1, price: 100, quantity: 1 }], totalAmount: 100 },
            auth: {
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    addresses: [
                        {
                            id: 'addr1',
                            isDefault: true,
                            fullName: 'John Doe Address',
                            phone: '0600000000',
                            address1: '123 Street',
                            city: 'Casablanca',
                            postalCode: '20000'
                        }
                    ]
                }
            }
        };

        renderWithProviders(<Checkout />, { preloadedState });

        // Check if input values are populated
        expect(screen.getByDisplayValue('John Doe Address')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Casablanca')).toBeInTheDocument();
    });

});
