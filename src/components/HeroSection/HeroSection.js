import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap, Activity, Wind, Layers } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { openCart } from '../../store/slices/uiSlice';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import './HeroSection.css';

const HeroSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const heroSlides = useSelector(state => state.content.heroSlides);
    const products = useSelector(state => state.products.items);
    const [activeSneaker, setActiveSneaker] = useState(heroSlides[0]);

    useEffect(() => {
        if (heroSlides && heroSlides.length > 0) {
            const currentExists = heroSlides.find(s => s.id === activeSneaker?.id);
            if (!currentExists) {
                setActiveSneaker(heroSlides[0]);
            } else if (JSON.stringify(currentExists) !== JSON.stringify(activeSneaker)) {
                setActiveSneaker(currentExists);
            }
        }
    }, [heroSlides, activeSneaker]);

    return (
        <div className="container hero-container">
            <div className="hero-grid">
                <div className="hero-text-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSneaker.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.span
                                className="hero-badge"
                                style={{
                                    background: `linear-gradient(90deg, ${activeSneaker.color}, ${activeSneaker.accent})`,
                                    WebkitBackgroundClip: 'text',
                                }}
                            >
                                {t('hero.badge')}
                            </motion.span>

                            <h1 className="hero-title">
                                {activeSneaker.name} <br />
                                <span style={{
                                    color: activeSneaker.color,
                                    textShadow: '0 0 30px rgba(0,0,0,0.1)'
                                }}>{activeSneaker.tagline}</span>
                            </h1>

                            <p className="hero-description">
                                {activeSneaker.description}
                            </p>

                            <div className="hero-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        const prod = products.find(p => p.name === activeSneaker.name) || products[0];
                                        dispatch(addToCart({ product: prod, size: prod.sizes?.[0]?.size || 42 }));
                                        dispatch(openCart());
                                        showToast(t('common.added_to_cart'), "success", prod.image);
                                    }}
                                    style={{
                                        background: `linear-gradient(135deg, ${activeSneaker.color}, ${activeSneaker.accent})`
                                    }}
                                >
                                    {t('common.buy')} <ShoppingBag size={20} />
                                </button>

                                <button
                                    className="hero-btn-details"
                                    onClick={() => {
                                        const prod = products.find(p => p.name === activeSneaker.name) || products[0];
                                        navigate(`/product/${prod.id}`);
                                    }}
                                >
                                    {t('common.details')} <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hero-img-area">
                    <div
                        className="hero-img-glow"
                        style={{ background: `${activeSneaker.color}20` }}
                    />

                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeSneaker.id}
                            src={activeSneaker.image}
                            alt={activeSneaker.name}
                            loading="lazy"
                            initial={{ opacity: 0, scale: 0.9, rotate: -15 }}
                            animate={{ opacity: 1, scale: 1.1, rotate: -25 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => {
                                const prod = products.find(p => p.name === activeSneaker.name) || products[0];
                                navigate(`/product/${prod.id}`);
                            }}
                            className="hero-main-img"
                        />
                    </AnimatePresence>
                </div>
            </div>

            <div className="hero-thumbs">
                {heroSlides.map((sneaker) => {
                    const isActive = activeSneaker.id === sneaker.id;
                    return (
                        <div
                            key={sneaker.id}
                            onClick={() => setActiveSneaker(sneaker)}
                            className="thumb-card"
                            style={{
                                background: isActive ? `linear-gradient(135deg, ${sneaker.color}, ${sneaker.accent})` : 'var(--bg-card)',
                                boxShadow: isActive ? `0 15px 30px ${sneaker.color}30` : 'var(--shadow-clean)',
                                border: `1px solid ${isActive ? 'transparent' : 'var(--border-subtle)'}`
                            }}
                        >
                            <div className="thumb-img-box">
                                <img src={sneaker.image} alt={sneaker.name} className="thumb-img" />
                            </div>
                            <div>
                                <span className="thumb-name" style={{ color: isActive ? 'white' : 'var(--text-main)' }}>
                                    {sneaker.name}
                                </span>
                                <span className="thumb-tagline" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--text-gray)' }}>
                                    {sneaker.tagline}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroSection;
