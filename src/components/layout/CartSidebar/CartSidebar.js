import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, removeItemCompletely } from '../../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../EmptyState/EmptyState';
import SmartImage from '../SmartImage/SmartImage';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    // Calculate total dynamically from items to avoid corrupted state
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="cart-sidebar-backdrop" />
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={{ left: 0.1, right: 0.8 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.x > 100 || velocity.x > 500) {
                                onClose();
                            }
                        }}
                        className="cart-sidebar"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                    >
                        <div className="cart-sidebar-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="cart-sidebar-icon-container" aria-hidden="true"><ShoppingBag size={20} /></div>
                                <div><h2 id="cart-title" className="cart-sidebar-title">{t('cart.title')}</h2><span className="cart-sidebar-item-count">{t('cart.items_count', { count: cartItems.length })}</span></div>
                            </div>
                            <button onClick={onClose} className="cart-sidebar-close-btn" aria-label={t('cart.close')}><X size={24} /></button>
                        </div>
                        <div className="cart-sidebar-content">
                            {cartItems.length === 0 ? (
                                <EmptyState
                                    icon={ShoppingBag}
                                    title={t('cart.empty')}
                                    description={t('cart.empty_desc')}
                                    ctaText={t('cart.continue_shopping')}
                                    onCtaClick={onClose}
                                />
                            ) : (
                                <div className="cart-sidebar-list">
                                    <AnimatePresence mode='popLayout'>
                                        {cartItems.map((item, index) => (
                                            <motion.div layout key={`${item.id}-${item.size}`} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ delay: index * 0.05 }} className="cart-sidebar-item">
                                                <div className="cart-sidebar-item-img-wrapper"><SmartImage src={item.image} alt={item.name} className="cart-sidebar-item-image" /></div>
                                                <div className="cart-sidebar-item-info">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div><h4 className="cart-sidebar-item-name">{item.name}</h4><span className="cart-sidebar-item-size-badge">{t('cart.size')}: {item.size}</span></div>
                                                        <button
                                                            onClick={() => dispatch(removeItemCompletely({ id: item.id, size: item.size }))}
                                                            className="cart-sidebar-delete-btn"
                                                            aria-label={`${t('cart.remove')} ${item.name}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="cart-sidebar-item-action-row">
                                                        <div className="cart-sidebar-qty-controls">
                                                            <button
                                                                onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                                                                className="cart-sidebar-qty-btn"
                                                                aria-label={t('cart.decrease', { name: item.name })}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="cart-sidebar-qty-value" aria-label={`${t('cart.qty')}: ${item.quantity}`}>{item.quantity}</span>
                                                            <button
                                                                onClick={() => {
                                                                    // Pass item with originalPrice to prevent double discounting
                                                                    const productData = {
                                                                        ...item,
                                                                        price: item.originalPrice || item.price,
                                                                        originalPrice: item.originalPrice || item.price,
                                                                        discount: item.discount || 0
                                                                    };
                                                                    dispatch(addToCart({ product: productData, size: item.size }));
                                                                }}
                                                                className="cart-sidebar-qty-btn"
                                                                aria-label={t('cart.increase', { name: item.name })}
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <span className="cart-sidebar-item-total-price">{item.totalPrice} DH</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                        <div className="cart-sidebar-footer">
                            <div className="cart-sidebar-summary-box">
                                <div className="cart-sidebar-summary-row"><span className="cart-sidebar-summary-label">{t('cart.subtotal')}</span><span className="cart-sidebar-summary-value">{totalAmount.toFixed(2)} DH</span></div>
                                <div className="cart-sidebar-summary-row"><span className="cart-sidebar-summary-label">{t('cart.shipping')}</span><span className="cart-sidebar-summary-value">{t('cart.free')}</span></div>
                                <div className="cart-sidebar-summary-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}><span className="cart-sidebar-total-label">{t('cart.total')}</span><span className="cart-sidebar-total-value">{totalAmount.toFixed(2)} DH</span></div>
                            </div>
                            <button onClick={() => { onClose(); navigate('/checkout'); }} className="cart-sidebar-checkout-btn" disabled={cartItems.length === 0}><ShoppingBag size={20} /> {t('cart.checkout_btn')}</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
