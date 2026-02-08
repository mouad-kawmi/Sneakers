import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User, LayoutDashboard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../constants/routes';
import { useTranslation } from 'react-i18next';
import useAuth from '../../../hooks/useAuth';
import './BottomNav.css';

const BottomNav = ({ onCartOpen }) => {
    const { t } = useTranslation();
    const { isAdmin } = useAuth();
    const location = useLocation();
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const navItems = [
        { icon: Home, label: t('nav.home'), path: ROUTES.HOME, id: 'home' },
        { icon: Search, label: t('nav.search'), path: ROUTES.SEARCH, id: 'search' },
        { icon: ShoppingBag, label: t('common.cart'), onClick: onCartOpen, id: 'cart', badge: totalQuantity },
        { icon: Heart, label: t('common.wishlist'), path: ROUTES.WISHLIST, id: 'wishlist', badge: wishlistItems.length },
        { icon: User, label: 'Profil', path: ROUTES.PROFILE, id: 'profile' },
    ];

    // If admin, replace search or add admin link
    if (isAdmin) {
        navItems.splice(1, 1, { icon: LayoutDashboard, label: 'Admin', path: ROUTES.ADMIN, id: 'admin' });
    }

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
