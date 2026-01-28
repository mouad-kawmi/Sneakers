import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../constants/routes';
import './BottomNav.css';

const BottomNav = ({ onCartOpen }) => {
    const location = useLocation();
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const navItems = [
        { icon: Home, label: 'Accueil', path: ROUTES.HOME, id: 'home' },
        { icon: Search, label: 'Chercher', path: ROUTES.SEARCH, id: 'search' },
        { icon: ShoppingBag, label: 'Panier', onClick: onCartOpen, id: 'cart', badge: totalQuantity },
        { icon: Heart, label: 'Favoris', path: ROUTES.WISHLIST, id: 'wishlist', badge: wishlistItems.length },
        { icon: User, label: 'Profil', path: ROUTES.PROFILE, id: 'profile' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                const content = (
                    <div className={`bottom-nav-item ${isActive ? 'active' : ''} btn-animate`}>
                        <div className="bottom-nav-icon-wrapper">
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {item.badge > 0 && (
                                <span className="bottom-nav-badge">{item.badge}</span>
                            )}
                        </div>
                        <span className="bottom-nav-label">{item.label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="bottom-nav-indicator"
                                className="bottom-nav-indicator"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </div>
                );

                return item.onClick ? (
                    <button key={item.id} onClick={item.onClick} className="bottom-nav-link-btn">
                        {content}
                    </button>
                ) : (
                    <Link key={item.id} to={item.path} className="bottom-nav-link">
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
