import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, Menu, X, User, LogOut, Search, Heart, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../store/slices/themeSlice';
import { logout } from '../../../store/slices/authSlice';
import { setFilters, clearFilters } from '../../../store/slices/productSlice';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '../../auth/LoginModal/LoginModal';
import './Navbar.css';

const Navbar = ({ onCartOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeMode = useSelector((state) => state.theme.mode);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const products = useSelector((state) => state.products.items);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const unreadMessagesCount = useSelector((state) => state.messages?.unreadCount || 0);

    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

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
        { id: 'home', name: 'Accueil', path: '/' },
        { id: 'Men', name: 'Hommes', path: '/category/Men' },
        { id: 'Women', name: 'Femmes', path: '/category/Women' },
        { id: 'Kids', name: 'Enfants', path: '/category/Kids' },
        { id: 'contact', name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link
                    to="/"
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
                            to="/admin"
                            className="navbar-link"
                            style={{
                                color: location.pathname === '/admin' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 'bold',
                                position: 'relative'
                            }}
                        >
                            Tableau de Bord
                            {unreadMessagesCount > 0 && (
                                <span className="navbar-admin-notif-dot"></span>
                            )}
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="navbar-icon-btn btn-animate"
                            aria-label={isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
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
                                            placeholder="Chercher une paire..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-label="Rechercher des produits"
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
                                                                navigate(`/product/${p.id}`);
                                                                setIsSearchOpen(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="navbar-result-item"
                                                        >
                                                            <img src={p.image} alt={p.name} className="navbar-result-img" />
                                                            <div style={{ flex: 1 }}>
                                                                <h4 className="navbar-result-name">{p.name}</h4>
                                                                <span className="navbar-result-price">{p.price} DH</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="navbar-no-results">
                                                    Aucun résultat pour "{searchQuery}"
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
                                            aria-label="Fermer la recherche"
                                        >
                                            <X size={24} />
                                        </button>
                                        <span className="navbar-overlay-title">Recherche</span>
                                        <div style={{ width: 24 }}></div>
                                    </div>

                                    <div className="navbar-overlay-body">
                                        <div className="navbar-mobile-input-wrapper">
                                            <Search size={20} style={{ color: 'var(--primary)' }} aria-hidden="true" />
                                            <input
                                                id="navbar-search-mobile"
                                                autoFocus
                                                type="text"
                                                placeholder="Quelle paire cherchez-vous ?"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                aria-label="Rechercher des produits"
                                                className="navbar-mobile-search-input"
                                            />
                                        </div>

                                        <div className="navbar-mobile-results">
                                            {searchQuery.trim() !== '' && filteredProducts.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        navigate(`/product/${p.id}`);
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="navbar-mobile-result-item"
                                                >
                                                    <img src={p.image} alt={p.name} className="navbar-mobile-result-img" />
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
                        className="navbar-icon-btn btn-animate"
                        aria-label={themeMode === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
                    >
                        {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                            className="navbar-icon-btn btn-animate"
                            aria-label="Voir mes favoris"
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
                                    <h3 className="navbar-dropdown-title">Mes Favoris</h3>
                                    {wishlistItems.length === 0 ? (
                                        <p className="navbar-empty-text">Votre liste est vide.</p>
                                    ) : (
                                        <div className="navbar-dropdown-list">
                                            {wishlistItems.map(item => (
                                                <div key={item.id} className="navbar-dropdown-item">
                                                    <img src={item.image} alt={item.name} className="navbar-dropdown-img" onClick={() => { navigate(`/product/${item.id}`); setIsWishlistOpen(false); }} />
                                                    <div style={{ flex: 1 }} onClick={() => { navigate(`/product/${item.id}`); setIsWishlistOpen(false); }}>
                                                        <h4 className="navbar-dropdown-item-name">{item.name}</h4>
                                                        <span className="navbar-dropdown-item-price">{item.price} DH</span>
                                                    </div>
                                                    <button
                                                        onClick={() => dispatch(toggleWishlist(item))}
                                                        className="navbar-remove-btn btn-animate"
                                                        aria-label={`Supprimer ${item.name} des favoris`}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="navbar-dropdown-footer-btn"
                                                onClick={() => { navigate('/wishlist'); setIsWishlistOpen(false); }}
                                            >
                                                Voir tout mes favoris
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
                                onClick={() => navigate('/profile')}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                title="Voir mon profil"
                            >
                                <User size={18} />
                                Salut, {user?.name.split(' ')[0]}
                            </span>
                            <button
                                onClick={() => dispatch(logout())}
                                className="navbar-icon-btn btn-animate"
                                title="Se déconnecter"
                                aria-label="Se déconnecter"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="navbar-icon-btn btn-animate"
                            title="Se connecter"
                            aria-label="Se connecter"
                        >
                            <User size={20} />
                        </button>
                    )}

                    <button
                        onClick={onCartOpen}
                        className="navbar-icon-btn btn-animate"
                        aria-label="Voir le panier"
                    >
                        <ShoppingBag size={20} />
                        {totalQuantity > 0 && (
                            <span className="navbar-badge">{totalQuantity}</span>
                        )}
                    </button>

                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
                                    <h4 className="navbar-drawer-label">Navigation</h4>
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
                                    <h4 className="navbar-drawer-label">Mon Compte</h4>
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/profile" className="navbar-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                                                <User size={18} /> Mon Profil
                                            </Link>
                                            <button onClick={() => { dispatch(logout()); setIsMobileMenuOpen(false); }} className="navbar-drawer-link logout">
                                                <LogOut size={18} /> Se déconnecter
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="navbar-drawer-link">
                                            <User size={18} /> Se connecter
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="navbar-drawer-footer">
                                <p>© 2026 Sberdila. Tous droits réservés.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
