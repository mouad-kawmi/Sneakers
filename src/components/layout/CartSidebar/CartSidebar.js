import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, removeItemCompletely } from '../../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../EmptyState/EmptyState';
import SmartImage from '../SmartImage/SmartImage';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalAmount = useSelector((state) => state.cart.totalAmount);

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
                                <div><h2 id="cart-title" className="cart-sidebar-title">Mon Panier</h2><span className="cart-sidebar-item-count">{cartItems.length} Articles</span></div>
                            </div>
                            <button onClick={onClose} className="cart-sidebar-close-btn" aria-label="Fermer le panier"><X size={24} /></button>
                        </div>
                        <div className="cart-sidebar-content">
                            {cartItems.length === 0 ? (
                                <EmptyState
                                    icon={ShoppingBag}
                                    title="Votre panier est vide"
                                    description="Il semble que vous n'ayez pas encore ajouté de produits. Découvrez nos dernières nouveautés !"
                                    ctaText="Continuer mes achats"
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
                                                        <div><h4 className="cart-sidebar-item-name">{item.name}</h4><span className="cart-sidebar-item-size-badge">Taille: {item.size}</span></div>
                                                        <button
                                                            onClick={() => dispatch(removeItemCompletely({ id: item.id, size: item.size }))}
                                                            className="cart-sidebar-delete-btn"
                                                            aria-label={`Supprimer ${item.name} du panier`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="cart-sidebar-item-action-row">
                                                        <div className="cart-sidebar-qty-controls">
                                                            <button
                                                                onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                                                                className="cart-sidebar-qty-btn"
                                                                aria-label={`Diminuer la quantité de ${item.name}`}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="cart-sidebar-qty-value" aria-label={`Quantité: ${item.quantity}`}>{item.quantity}</span>
                                                            <button
                                                                onClick={() => dispatch(addToCart({ product: item, size: item.size }))}
                                                                className="cart-sidebar-qty-btn"
                                                                aria-label={`Augmenter la quantité de ${item.name}`}
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
                                <div className="cart-sidebar-summary-row"><span className="cart-sidebar-summary-label">Sous-total</span><span className="cart-sidebar-summary-value">{totalAmount.toFixed(2)} DH</span></div>
                                <div className="cart-sidebar-summary-row"><span className="cart-sidebar-summary-label">Livraison</span><span className="cart-sidebar-summary-value">Gratuite</span></div>
                                <div className="cart-sidebar-summary-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}><span className="cart-sidebar-total-label">Total</span><span className="cart-sidebar-total-value">{totalAmount.toFixed(2)} DH</span></div>
                            </div>
                            <button onClick={() => { onClose(); navigate('/checkout'); }} className="cart-sidebar-checkout-btn" disabled={cartItems.length === 0}><ShoppingBag size={20} /> Proceder au Paiement</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
