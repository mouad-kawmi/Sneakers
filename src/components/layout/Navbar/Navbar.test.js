import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from './Navbar';
import themeReducer from '../../../store/slices/themeSlice';
import cartReducer from '../../../store/slices/cartSlice';
import wishlistReducer from '../../../store/slices/wishlistSlice';
import productReducer from '../../../store/slices/productSlice';
import authReducer from '../../../store/slices/authSlice';
import messageReducer from '../../../store/slices/messageSlice';

import { ToastProvider } from '../../../context/ToastContext';

// Helper to render with Redux and Router
const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                theme: themeReducer,
                cart: cartReducer,
                wishlist: wishlistReducer,
                products: productReducer,
                auth: authReducer,
                messages: messageReducer,
            },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) => {
    // console.log('Initial State:', store.getState()); 
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>
                <ToastProvider>{children}</ToastProvider>
            </BrowserRouter>
        </Provider>
    );
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('Navbar Component', () => {
    test('renders logo and navigation links', () => {
        renderWithProviders(<Navbar />);

        expect(screen.getByText('Sberdila')).toBeInTheDocument();
        expect(screen.getByText('Accueil')).toBeInTheDocument();
        expect(screen.getByText('Hommes')).toBeInTheDocument();
        expect(screen.getByText('Femmes')).toBeInTheDocument();
    });

    test('toggles mobile menu', () => {
        renderWithProviders(<Navbar />);

        // Initial state: menu hidden (assuming desktop view by default in JSDOM, 
        // but the button should trigger state change)
        // Note: Actual visibility checking might depend on CSS media queries which JSDOM doesn't fully support.
        // We check if the button exists and expands.

        const toggleButton = screen.getByLabelText('Ouvrir le menu');
        expect(toggleButton).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
    });

    test('opens cart when cart icon is clicked', () => {
        const handleCartOpen = jest.fn();
        renderWithProviders(<Navbar onCartOpen={handleCartOpen} />);

        const cartButton = screen.getByLabelText('Voir le panier');
        fireEvent.click(cartButton);

        expect(handleCartOpen).toHaveBeenCalledTimes(1);
    });

    test('displays search input when search icon is clicked', () => {
        renderWithProviders(<Navbar />);

        const searchButton = screen.getByLabelText('Ouvrir la recherche');
        fireEvent.click(searchButton);

        const searchInput = screen.getByPlaceholderText('Chercher une paire...');
        expect(searchInput).toBeInTheDocument();
    });

    test('shows user name when authenticated', () => {
        const preloadedState = {
            auth: {
                isAuthenticated: true,
                user: { name: 'Mouad', role: 'user' },
            },
        };

        renderWithProviders(<Navbar />, { preloadedState });

        expect(screen.getByText('Salut, Mouad')).toBeInTheDocument();
        expect(screen.getByTitle('Se déconnecter')).toBeInTheDocument();
    });

    test('shows admin link when user is admin', () => {
        const preloadedState = {
            auth: {
                isAuthenticated: true,
                user: { name: 'Admin', role: 'admin' },
            },
        };

        renderWithProviders(<Navbar />, { preloadedState });

        expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
    });
});
