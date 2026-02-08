import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, Menu, X, User, LogOut, Search, Heart, Trash2, LayoutDashboard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/slices/themeSlice';
import { logout } from '../../../store/slices/authSlice';
import { setFilters, clearFilters } from '../../../store/slices/productSlice';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { openLoginModal } from '../../../store/slices/uiSlice';
import { useTranslation } from 'react-i18next';
import SmartImage from '../SmartImage/SmartImage';
import { ROUTES, getCategoryPath, getProductPath } from '../../../constants/routes';
import './Navbar.css';
import './NavbarDrawer.css';

const Navbar = ({ onCartOpen }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeMode = useSelector((state) => state.theme.mode);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const products = useSelector((state) => state.products.items);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const unreadMessagesCount = useSelector((state) => state.messages?.unreadCount || 0);
    const unreadOrdersCount = useSelector((state) => state.orders?.unreadOrdersCount || 0);

    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    const filteredProducts = searchQuery.trim() === ''
        ? []
        : products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

    const handleNavClick = (link) => {
        setIsMobileMenuOpen(false);
        if (link.id === 'home') {
            dispatch(clearFilters());
            navigate('/');
        } else if (['Men', 'Women', 'Kids'].includes(link.id)) {
            dispatch(setFilters({ category: link.id, brand: 'All' }));
            navigate(link.path);
        }
    };

    const navLinks = [
        { id: 'home', name: t('nav.home'), path: ROUTES.HOME },
        { id: 'Men', name: t('nav.men'), path: getCategoryPath('Men') },
        { id: 'Women', name: t('nav.women'), path: getCategoryPath('Women') },
        { id: 'Kids', name: t('nav.kids'), path: getCategoryPath('Kids') },
        { id: 'contact', name: t('nav.contact'), path: ROUTES.CONTACT },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link
                    to={ROUTES.HOME}
                    onClick={() => dispatch(clearFilters())}
                    className="navbar-logo"
                >
                    Sberdila
                </Link>

                <div className="navbar-desktop-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            aria-current={location.pathname === link.path ? 'page' : undefined}
                            onClick={(e) => {
                                if (['home', 'Men', 'Women', 'Kids'].includes(link.id)) {
                                    e.preventDefault();
                                    handleNavClick(link);
                                }
                            }}
                            className="navbar-link"
                            style={{ color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            to={ROUTES.ADMIN}
                            className="navbar-link"
                            style={{
                                color: location.pathname === '/admin' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 'bold',
                                position: 'relative'
                            }}
                        >
                            {t('nav.dashboard')}
                            {(unreadMessagesCount + unreadOrdersCount) > 0 && (
                                <span className="navbar-admin-notif-badge">
                                    {unreadMessagesCount + unreadOrdersCount}
                                </span>
                            )}
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <button
                        onClick={toggleLanguage}
                        className="navbar-icon-btn btn-animate nav-btn-lang"
                        style={{ fontWeight: '800', fontSize: '13px' }}
                        title={t('nav.lang_switch_title')}
                        aria-label={t('nav.lang_switch_title')}
                    >
                        {i18n.language === 'fr' ? 'EN' : 'FR'}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="navbar-icon-btn btn-animate nav-btn-search"
                            aria-label={isSearchOpen ? t('common.close') : t('common.search')}
                            aria-expanded={isSearchOpen}
                        >
                            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>

                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="navbar-search-dropdown"
                                >
                                    <div className="navbar-search-header">
                                        <Search
                                            size={18}
                                            style={{ opacity: 0.5, cursor: 'pointer' }}
                                            aria-hidden="true"
                                            onClick={() => {
                                                if (searchQuery.trim()) {
                                                    navigate(`/search?q=${searchQuery}`);
                                                    setIsSearchOpen(false);
                                                }
                                            }}
                                        />
                                        <input
                                            id="navbar-search-desktop"
                                            autoFocus
                                            type="text"
                                            placeholder={t('common.search_placeholder')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-label={t('nav.search_aria')}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    navigate(`/search?q=${searchQuery}`);
                                                    setIsSearchOpen(false);
                                                }
                                            }}
                                            className="navbar-search-input"
                                        />
                                    </div>

                                    {searchQuery.trim() !== '' && (
                                        <div className="navbar-results-wrapper">
                                            {filteredProducts.length > 0 ? (
                                                <div className="navbar-results-list">
                                                    {filteredProducts.map(p => (
                                                        <motion.div
                                                            key={p.id}
                                                            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                                            onClick={() => {
                                                                navigate(getProductPath(p.id));
                                                                setIsSearchOpen(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="navbar-result-item"
                                                        >
                                                            <SmartImage src={p.image} alt={p.name} className="navbar-result-img" />
                                                            <div style={{ flex: 1 }}>
                                                                <h4 className="navbar-result-name">{p.name}</h4>
                                                                <span className="navbar-result-price">{p.price} DH</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="navbar-no-results">
                                                    {t('common.no_results', { query: searchQuery })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="navbar-mobile-search-overlay"
                                >
                                    <div className="navbar-overlay-header">
                                        <button
                                            onClick={() => setIsSearchOpen(false)}
                                            className="navbar-overlay-close"
                                            aria-label={t('nav.close_search')}
                                        >
                                            <X size={24} />
                                        </button>
                                        <span className="navbar-overlay-title">{t('common.search')}</span>
                                        <div style={{ width: 24 }}></div>
                                    </div>

                                    <div className="navbar-overlay-body">
                                        <div className="navbar-mobile-input-wrapper">
                                            <Search size={20} style={{ color: 'var(--primary)' }} aria-hidden="true" />
                                            <input
                                                id="navbar-search-mobile"
                                                autoFocus
                                                type="text"
                                                placeholder={t('common.search_placeholder')}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                aria-label={t('nav.search_aria')}
                                                className="navbar-mobile-search-input"
                                            />
                                        </div>

                                        <div className="navbar-mobile-results">
                                            {searchQuery.trim() !== '' && filteredProducts.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        navigate(getProductPath(p.id));
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="navbar-mobile-result-item"
                                                >
                                                    <SmartImage src={p.image} alt={p.name} className="navbar-mobile-result-img" />
                                                    <div style={{ flex: 1 }}>
                                                        <h4 className="navbar-result-name">{p.name}</h4>
                                                        <span className="navbar-result-price">{p.price} DH</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="navbar-icon-btn btn-animate nav-btn-theme"
                        aria-label={themeMode === 'dark' ? t('common.light_mode') : t('common.dark_mode')}
                    >
                        {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                            className="navbar-icon-btn btn-animate nav-btn-wishlist"
                            aria-label={t('nav.wishlist_aria')}
                            aria-expanded={isWishlistOpen}
                        >
                            <Heart size={20} />
                            {wishlistItems.length > 0 && <span className="navbar-badge">{wishlistItems.length}</span>}
                        </button>
                        <AnimatePresence>
                            {isWishlistOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="navbar-wishlist-dropdown"
                                >
                                    <h3 className="navbar-dropdown-title">{t('common.wishlist')}</h3>
                                    {wishlistItems.length === 0 ? (
                                        <p className="navbar-empty-text">{t('nav.wishlist_empty')}</p>
                                    ) : (
                                        <div className="navbar-dropdown-list">
                                            {wishlistItems.map(item => (
                                                <div key={item.id} className="navbar-dropdown-item">
                                                    <SmartImage src={item.image} alt={item.name} className="navbar-dropdown-img" onClick={() => { navigate(getProductPath(item.id)); setIsWishlistOpen(false); }} />
                                                    <div style={{ flex: 1 }} onClick={() => { navigate(getProductPath(item.id)); setIsWishlistOpen(false); }}>
                                                        <h4 className="navbar-dropdown-item-name">{item.name}</h4>
                                                        <span className="navbar-dropdown-item-price">{item.price} DH</span>
                                                    </div>
                                                    <button
                                                        onClick={() => dispatch(toggleWishlist(item))}
                                                        className="navbar-remove-btn btn-animate"
                                                        aria-label={`${t('cart.remove')} ${item.name}`}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="navbar-dropdown-footer-btn"
                                                onClick={() => { navigate(ROUTES.WISHLIST); setIsWishlistOpen(false); }}
                                            >
                                                {t('nav.view_wishlist')}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isAuthenticated ? (
                        <div className="navbar-user-profile">
                            <span
                                className="navbar-user-name"
                                onClick={() => navigate(ROUTES.PROFILE)}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <User size={18} />
                                <span className="navbar-user-text">{t('auth.welcome')}, {user?.name?.split(' ')[0] || 'User'}</span>
                            </span>
                            <button
                                onClick={() => dispatch(logout())}
                                className="navbar-icon-btn btn-animate nav-btn-logout"
                                title={t('auth.logout')}
                                aria-label={t('auth.logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(openLoginModal())}
                            className="navbar-icon-btn btn-animate nav-btn-auth"
                            title={t('auth.login')}
                            aria-label={t('auth.login')}
                        >
                            <User size={20} />
                        </button>
                    )}

                    <button
                        onClick={onCartOpen}
                        className="navbar-icon-btn btn-animate nav-btn-cart"
                        aria-label={t('cart.title')}
                    >
                        <ShoppingBag size={20} />
                        {totalQuantity > 0 && (
                            <span className="navbar-badge">{totalQuantity}</span>
                        )}
                    </button>

                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? t('nav.menu_close') : t('nav.menu_open')}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`navbar-mobile-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`navbar-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}
                        >
                            <div className="navbar-drawer-header">
                                <span className="navbar-logo">Sberdila</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="navbar-icon-btn">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="navbar-drawer-content">
                                <div className="navbar-drawer-section">
                                    <h4 className="navbar-drawer-label">{t('nav.navigation')}</h4>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`navbar-drawer-link ${location.pathname === link.path ? 'active' : ''}`}
                                            onClick={(e) => {
                                                if (['home', 'Men', 'Women', 'Kids'].includes(link.id)) {
                                                    e.preventDefault();
                                                    handleNavClick(link);
                                                } else {
                                                    setIsMobileMenuOpen(false);
                                                }
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="navbar-drawer-section">
                                    <h4 className="navbar-drawer-label">{t('nav.my_account')}</h4>
                                    {isAuthenticated ? (
                                        <>
                                            {user?.role === 'admin' && (
                                                <Link to={ROUTES.ADMIN} className="navbar-drawer-link admin-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <LayoutDashboard size={18} /> {t('nav.dashboard')}
                                                </Link>
                                            )}
                                            <Link to={ROUTES.PROFILE} className="navbar-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                                                <User size={18} /> {t('nav.user_profile')}
                                            </Link>
                                            <button onClick={() => { dispatch(logout()); setIsMobileMenuOpen(false); }} className="navbar-drawer-link logout">
                                                <LogOut size={18} /> {t('auth.logout')}
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => { dispatch(openLoginModal()); setIsMobileMenuOpen(false); }} className="navbar-drawer-link">
                                            <User size={18} /> {t('auth.login')}
                                        </button>
                                    )}
                                </div>

                                <div className="navbar-drawer-section">
                                    <h4 className="navbar-drawer-label">{t('nav.language')}</h4>
                                    <div className="navbar-drawer-lang-grid">
                                        <button
                                            onClick={() => { i18n.changeLanguage('fr'); setIsMobileMenuOpen(false); }}
                                            className={`navbar-drawer-lang-btn ${i18n.language === 'fr' ? 'active' : ''}`}
                                        >
                                            🇫🇷 {t('common.fr')}
                                        </button>
                                        <button
                                            onClick={() => { i18n.changeLanguage('en'); setIsMobileMenuOpen(false); }}
                                            className={`navbar-drawer-lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                                        >
                                            🇺🇸 {t('common.en')}
                                        </button>
                                    </div>
                                </div>

                                <div className="navbar-drawer-section">
                                    <h4 className="navbar-drawer-label">{t('common.theme')}</h4>
                                    <div className="navbar-drawer-lang-grid">
                                        <button
                                            onClick={() => { dispatch(toggleTheme()); setIsMobileMenuOpen(false); }}
                                            className={`navbar-drawer-lang-btn ${themeMode === 'light' ? 'active' : ''}`}
                                        >
                                            <Sun size={18} style={{ marginRight: '8px' }} /> {t('common.light_mode')}
                                        </button>
                                        <button
                                            onClick={() => { dispatch(toggleTheme()); setIsMobileMenuOpen(false); }}
                                            className={`navbar-drawer-lang-btn ${themeMode === 'dark' ? 'active' : ''}`}
                                        >
                                            <Moon size={18} style={{ marginRight: '8px' }} /> {t('common.dark_mode')}
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div className="navbar-drawer-footer">
                                <p>{t('nav.copyright_simple')}</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
