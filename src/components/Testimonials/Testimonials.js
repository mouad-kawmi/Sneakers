import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
    const { t } = useTranslation();
    const reviews = useSelector(state => state.reviews?.items || []);
    const featuredReviews = Array.isArray(reviews) ? reviews.filter(r => r.isFeatured) : [];

    const [currentIndex, setCurrentIndex] = useState(0);

    if (featuredReviews.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(featuredReviews.length / 3));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(featuredReviews.length / 3)) % Math.ceil(featuredReviews.length / 3));
    };

    const itemsToShow = featuredReviews.slice(currentIndex * 3, currentIndex * 3 + 3);

    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="testimonials-header">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="testimonials-badge"
                    >
                        {t('testimonials.badge')}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="testimonials-title"
                    >
                        {t('testimonials.title_main')}<span className="text-gradient">{t('testimonials.title_span')}</span>
                    </motion.h2>
                </div>

                <div className="testimonials-relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="testimonials-grid"
                        >
                            {itemsToShow.map((review) => (
                                <motion.div
                                    key={review.id}
                                    whileHover={{ y: -10 }}
                                    className="testimonial-card"
                                >
                                    <div className="testimonial-quote-icon">
                                        <Quote size={24} color="var(--primary)" />
                                    </div>

                                    <div className="testimonial-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < review.rating ? "var(--primary)" : "none"}
                                                color={i < review.rating ? "var(--primary)" : "#ddd"}
                                            />
                                        ))}
                                    </div>

                                    <p className="testimonial-comment">"{review.comment}"</p>

                                    <div className="testimonial-footer">
                                        <div className="testimonial-avatar">
                                            {review.userName.charAt(0)}
                                        </div>
                                        <div className="testimonial-user-info">
                                            <h4 className="testimonial-user-name">{review.userName}</h4>
                                            <span className="testimonial-verified">{t('testimonials.verified_buyer')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {featuredReviews.length > 3 && (
                        <>
                            <button onClick={prevSlide} className="testimonial-nav-btn" style={{ left: '-60px' }}>
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextSlide} className="testimonial-nav-btn" style={{ right: '-60px' }}>
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                <div className="testimonials-dots">
                    {[...Array(Math.ceil(featuredReviews.length / 3))].map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className="testimonials-dot"
                            style={{
                                width: currentIndex === i ? '24px' : '8px',
                                background: currentIndex === i ? 'var(--primary)' : '#ddd'
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
