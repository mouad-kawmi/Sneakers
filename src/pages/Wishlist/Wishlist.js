import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import SmartImage from '../../components/layout/SmartImage/SmartImage';
import SEO from '../../components/layout/SEO/SEO';
import './Wishlist.css';

const Wishlist = () => {
    const { t } = useTranslation();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        dispatch(addToCart({ product, size: product.sizes?.[0]?.size || 'M' }));
    };

    return (
        <div className="wishlist-page">
            <SEO title={t('seo.wishlist_title')} />
            <div className="container">
                <header className="wishlist-header">
                    <Heart size={32} className="wishlist-icon" />
                    <h1 className="wishlist-title">{t('wishlist_page.title')}</h1>
                    <p className="wishlist-subtitle">{t('wishlist_page.subtitle')}</p>
                </header>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="wishlist-empty"
                    >
                        <div className="empty-icon-wrapper">
                            <Heart size={64} strokeWidth={1} />
                        </div>
                        <h2>{t('wishlist_page.empty')}</h2>
                        <p>{t('wishlist_page.empty_desc')}</p>
                        <button onClick={() => navigate('/')} className="explore-btn">
                            {t('wishlist_page.explore')}
                        </button>
                    </motion.div>
                ) : (
                    <div className="wishlist-grid">
                        <AnimatePresence>
                            {wishlistItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="wishlist-card"
                                >
                                    <div className="wishlist-img-wrapper" onClick={() => navigate(`/product/${item.id}`)}>
                                        <SmartImage src={item.image} alt={item.name} className="wishlist-img" />
                                        <button
                                            className="remove-wishlist-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(toggleWishlist(item));
                                            }}
                                            aria-label={t('wishlist_page.remove')}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="wishlist-info">
                                        <h3 className="wishlist-item-brand">{item.brand}</h3>
                                        <h2 className="wishlist-item-name" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h2>
                                        <div className="wishlist-item-footer">
                                            <span className="wishlist-item-price">{item.price} DH</span>
                                            <button
                                                className="wishlist-add-cart-btn"
                                                onClick={() => handleAddToCart(item)}
                                            >
                                                <ShoppingBag size={18} /> {t('common.add')}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
