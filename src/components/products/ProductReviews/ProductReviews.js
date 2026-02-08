import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Send, User } from 'lucide-react';
import { addReview } from '../../../store/slices/reviewSlice';
import { getProductReviewsPath } from '../../../constants/routes';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const allReviews = useSelector(state => state.reviews?.items || []);
    const productReviews = Array.isArray(allReviews) ? allReviews.filter(r => r.productId === productId) : [];

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim() || !userName.trim()) return;

        dispatch(addReview({
            productId,
            userName,
            rating,
            comment
        }));

        setIsSubmitted(true);
        setComment('');
        setUserName('');
        setRating(5);

        setTimeout(() => {
            setIsSubmitted(false);
            setShowForm(false);
        }, 3000);
    };

    const averageRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : 0;

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <div className="reviews-header-left">
                    <h2 className="reviews-title">{t('reviews.title')}</h2>
                    <div className="reviews-score-box">
                        <span className="reviews-average">{averageRating}</span>
                        <div className="reviews-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.round(averageRating) ? "#FFC107" : "none"}
                                    color={i < Math.round(averageRating) ? "#FFC107" : "#ddd"}
                                />
                            ))}
                        </div>
                        <span className="reviews-count">({productReviews.length} {t('product.reviews').toLowerCase()})</span>
                    </div>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="reviews-write-btn"
                    >
                        {t('reviews.write_review')}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="reviews-form-wrapper"
                    >
                        <form onSubmit={handleSubmit} className="reviews-form">
                            <h3 className="reviews-form-title">{t('reviews.leave_review')}</h3>

                            <div className="reviews-rating-selector">
                                <label className="reviews-label">{t('reviews.your_rating')}</label>
                                <div className="reviews-star-rack">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <Star
                                            key={num}
                                            size={28}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            fill={(hoverRating || rating) >= num ? "#FFC107" : "none"}
                                            color={(hoverRating || rating) >= num ? "#FFC107" : "#ddd"}
                                            onMouseEnter={() => setHoverRating(num)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(num)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="reviews-input-group">
                                <label className="reviews-label">{t('profile.full_name')}</label>
                                <input
                                    type="text"
                                    placeholder={t('reviews.placeholder_name')}
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="reviews-input"
                                    required
                                />
                            </div>

                            <div className="reviews-input-group">
                                <label className="reviews-label">{t('product.description')}</label>
                                <textarea
                                    placeholder={t('reviews.placeholder_comment')}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="reviews-textarea"
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="submit"
                                    disabled={isSubmitted}
                                    className="reviews-submit-btn"
                                    style={{ background: isSubmitted ? '#2ED573' : 'var(--primary)' }}
                                >
                                    {isSubmitted ? t('reviews.sent') : <><Send size={18} /> {t('reviews.publish')}</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="reviews-cancel-btn"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="reviews-list">
                {productReviews.length === 0 ? (
                    <div className="reviews-empty">
                        {t('reviews.empty')}
                    </div>
                ) : (
                    <>
                        {productReviews.slice().reverse().slice(0, 10).map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="reviews-card"
                            >
                                <div className="reviews-card-header">
                                    <div className="reviews-user-avatar">
                                        <User size={18} />
                                    </div>
                                    <div className="reviews-meta">
                                        <h4 className="reviews-user-name">{review.userName}</h4>
                                        <span className="reviews-date">{review.date}</span>
                                    </div>
                                    <div className="reviews-card-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < review.rating ? "#FFC107" : "none"}
                                                color={i < review.rating ? "#FFC107" : "#ddd"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="reviews-comment-text">{review.comment}</p>
                            </motion.div>
                        ))}

                        {productReviews.length > 10 && (
                            <Link
                                to={getProductReviewsPath(productId)}
                                className="reviews-view-all-btn"
                            >
                                {t('reviews.view_all', { count: productReviews.length })}
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
