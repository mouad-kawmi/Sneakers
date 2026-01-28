import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import store, { persistor } from './store';
import Navbar from './components/layout/Navbar/Navbar';
import CartSidebar from './components/layout/CartSidebar/CartSidebar';
import Footer from './components/layout/Footer/Footer';
import BottomNav from './components/layout/BottomNav/BottomNav';
import Breadcrumbs from './components/layout/Breadcrumbs/Breadcrumbs';
import ScrollToTop from './components/layout/ScrollToTop/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import { openCart, closeCart } from './store/slices/uiSlice';
import { ROUTES } from './constants/routes';

// Initialize GA4 - Replace with your measurement ID
ReactGA.initialize('G-XXXXXXXXXX');

// Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home/Home'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Category = lazy(() => import('./pages/Category/Category'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const ProductReviewsPage = lazy(() => import('./pages/ProductReviewsPage/ProductReviewsPage'));
const HelpCenter = lazy(() => import('./pages/HelpCenter/HelpCenter'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const OrderTracking = lazy(() => import('./pages/OrderTracking/OrderTracking'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const SearchPage = lazy(() => import('./pages/Search/Search'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService'));

// Global Loader Component
const GlobalLoader = () => (
  <div className="global-loader-container">
    <div className="loader-shimmer" />
  </div>
);

// Helper to watch theme changes and update global DOM element
const ThemeWatcher = () => {
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return null;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);

  return (
    <ToastProvider>
      <Router>
        <ThemeWatcher />
        <div style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-main)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          overflowX: 'hidden',
          width: '100%'
        }}>
          <Navbar onCartOpen={() => dispatch(openCart())} />
          <CartSidebar isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
          <main className="main-content">
            <ScrollToTop />
            <Breadcrumbs />
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ADMIN} element={<Admin />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.CATEGORY} element={<Category />} />
                <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
                <Route path={ROUTES.PRODUCT_REVIEWS} element={<ProductReviewsPage />} />
                <Route path={ROUTES.HELP} element={<HelpCenter />} />
                <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
                <Route path={ROUTES.TRACK_ORDER} element={<OrderTracking />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
                <Route path={ROUTES.SEARCH} element={<SearchPage />} />
                <Route path={ROUTES.ABOUT} element={<AboutUs />} />
                <Route path={ROUTES.FAQ} element={<FAQ />} />
                <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
                <Route path={ROUTES.TERMS} element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <BottomNav onCartOpen={() => dispatch(openCart())} />
        </div>
      </Router>
    </ToastProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
