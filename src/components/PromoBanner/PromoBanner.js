import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { openCart } from '../../store/slices/uiSlice';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import './PromoBanner.css';

const PromoBanner = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const promoData = useSelector(state => state.content.promoBanner);
    const products = useSelector(state => state.products?.items || []);

    const calculateTimeLeft = () => {
        const difference = +new Date(promoData.endTime) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [promoData.endTime]);

    if (!promoData.isActive) return null;

    let promoProducts = [];
    if (promoData.selectedProductIds && promoData.selectedProductIds.length > 0) {
        promoProducts = promoData.selectedProductIds
            .slice(0, Math.min(promoData.productsCount || 3, 3))
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);
    } else {
        promoProducts = products
            .filter(p => p.discount > 0)
            .slice(0, promoData.productsCount || 3);
    }

    return (
        <div className="promo-banner-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="promo-banner-wrapper"
                style={{ background: promoData.gradient || 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}
            >
                <div className="promo-bg-circle-1"></div>
                <div className="promo-bg-circle-2"></div>

                <div className="promo-grid">
                    <div className="promo-product-column">
                        <div className="promo-product-showcase">
                            {promoProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="promo-showcase-card"
                                    style={{ zIndex: 10 - idx }}
                                >
                                    <div className="promo-discount-badge">-{promoData.discount}%</div>
                                    <img src={product.image} alt={product.name} className="promo-showcase-img" />
                                    <div className="promo-showcase-info">
                                        <h4 className="promo-showcase-title">{product.name}</h4>
                                        <p className="promo-showcase-price">{Math.floor(product.price * (1 - (promoData.discount / 100)))} DH</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            // Pass product with promo discount info
                                            const productWithDiscount = {
                                                ...product,
                                                discount: promoData.discount,
                                                discountEndTime: promoData.endTime
                                            };
                                            dispatch(addToCart({ product: productWithDiscount, size: product.sizes?.[0]?.size || 42 }));
                                            dispatch(openCart());
                                            showToast(t('common.added_to_cart'), "success", product.image);
                                        }}
                                        className="promo-add-btn"
                                    >
                                        {t('common.buy')}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="promo-info-column">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="promo-info-content"
                        >
                            <h2 className="promo-main-title">
                                {t('promo.title', { discount: promoData.discount })}
                            </h2>

                            <div className="promo-timer-wrap">
                                <div className="promo-timer-glass">
                                    <TimeUnit value={timeLeft.days} label={t('promo.days')} />
                                    <span className="promo-separator">:</span>
                                    <TimeUnit value={timeLeft.hours} label={t('promo.hours')} />
                                    <span className="promo-separator">:</span>
                                    <TimeUnit value={timeLeft.minutes} label={t('promo.mins')} />
                                    <span className="promo-separator">:</span>
                                    <TimeUnit value={timeLeft.seconds} label={t('promo.secs')} />
                                </div>
                            </div>

                            <button className="promo-cta">
                                {t('promo.view_limited')} <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const TimeUnit = ({ value, label }) => (
    <motion.div
        key={value}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center' }}
    >
        <div className="promo-time-unit-box">
            <span className="promo-time-value">{String(value).padStart(2, '0')}</span>
            <span className="promo-time-label">{label}</span>
        </div>
    </motion.div>
);

export default PromoBanner;
