import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../store/slices/cartSlice';
import { useToast } from '../../context/ToastContext';
import './ProductSpotlight.css';

const ProductSpotlight = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const products = useSelector(state => state.products?.items || []);
    const spotlightData = useSelector(state => state.content?.spotlight);

    if (!spotlightData?.isActive) return null;
    const spotlightItem = products.find(p => String(p.id) === String(spotlightData.productId));
    if (!spotlightItem) return null;

    return (
        <div className="container product-spotlight-container">
            <div className="product-spotlight-grid">
                <div style={{ zIndex: 2 }}>
                    <span className="product-spotlight-badge">{t('products_section.featured')}</span>
                    <h2 onClick={() => navigate(`/product/${spotlightItem.id}`)} className="product-spotlight-title">{t('spotlight.title')}</h2>
                    <p className="product-spotlight-description">{t('spotlight.description')}</p>
                    <div className="product-spotlight-highlights">
                        {['comfort', 'design', 'limited'].map((key, i) => (
                            <div key={i} className="product-spotlight-highlight-item">
                                <div className="product-spotlight-highlight-icon"><Check size={18} strokeWidth={3} /></div>
                                <span className="product-spotlight-highlight-text">{t(`spotlight.highlights.${key}`)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="product-spotlight-actions">
                        <div>
                            {spotlightItem.discount > 0 && <span className="product-spotlight-price-old">{spotlightItem.price} DH</span>}
                            <div className="product-spotlight-price-current">{spotlightItem.discount > 0 ? Math.floor(spotlightItem.price * (1 - spotlightItem.discount / 100)) : spotlightItem.price} DH</div>
                        </div>
                        <button onClick={() => {
                            const finalPrice = spotlightItem.discount > 0 ? Math.floor(spotlightItem.price * (1 - spotlightItem.discount / 100)) : spotlightItem.price;
                            dispatch(addToCart({ product: { ...spotlightItem, price: finalPrice }, size: spotlightItem.sizes?.[0]?.size || 42 }));
                            showToast(t('common.added_to_cart'), "success", spotlightItem.image);
                        }} className="btn-primary product-spotlight-buy-btn">{t('cart.add')} <ShoppingCart size={22} /></button>
                    </div>
                </div>
                <div className="product-spotlight-visual">
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="product-spotlight-bg-glow" />
                    <motion.img initial={{ rotate: -15, scale: 0.9, opacity: 0 }} whileInView={{ rotate: -15, scale: 1.15, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} src={spotlightItem.image} alt={spotlightItem.name} loading="lazy" onClick={() => navigate(`/product/${spotlightItem.id}`)} className="product-spotlight-image" />
                </div>
            </div>
        </div>
    );
};

export default ProductSpotlight;
