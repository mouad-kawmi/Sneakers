import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, User, SlidersHorizontal } from 'lucide-react';
import './ProductReviewsPage.css';

const ProductReviewsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);
    const product = products.find((p) => p.id === parseInt(id));
    const reviews = useSelector((state) => state.reviews.items);
    const productReviews = reviews.filter(r => r.productId === parseInt(id));

    const [sortBy, setSortBy] = useState('newest');
    const [sortedReviews, setSortedReviews] = useState([]);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        let result = [...productReviews];
        if (sortBy === 'newest') result.reverse();
        else if (sortBy === 'highest') result.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'lowest') result.sort((a, b) => a.rating - b.rating);
        setSortedReviews(result);
    }, [sortBy, productReviews]);

    if (!product) return null;

    const averageRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : 0;

    return (
        <div className="container product-reviews-page">
            <header className="product-reviews-header">
                <button onClick={() => navigate(-1)} className="product-reviews-back-btn" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ArrowLeft size={20} /></button>
                <div className="product-reviews-header-title"><h1 className="product-reviews-title">Tous les avis</h1><p className="product-reviews-subtitle">{product.name}</p></div>
            </header>

            <div className="product-reviews-summary-grid">
                <div className="product-reviews-rating-box">
                    <div className="product-reviews-large-score">{averageRating}</div>
                    <div className="product-reviews-stars">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(averageRating) ? "#FFC107" : "none"} color={i < Math.round(averageRating) ? "#FFC107" : "#ddd"} />)}
                    </div>
                    <span className="product-reviews-count">{productReviews.length} avis au total</span>
                </div>
                <div className="product-reviews-filter-section">
                    <div className="product-reviews-filter-label"><SlidersHorizontal size={18} /><span>Trier par :</span></div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="product-reviews-select">
                        <option value="newest">Plus récents</option>
                        <option value="highest">Mieux notés</option>
                        <option value="lowest">Moins bien notés</option>
                    </select>
                </div>
            </div>

            <div className="product-reviews-list">
                {sortedReviews.map((review, idx) => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="product-reviews-card">
                        <div className="product-reviews-card-header">
                            <div className="product-reviews-user-avatar"><User size={18} /></div>
                            <div className="product-reviews-meta"><h4 className="product-reviews-user-name">{review.userName}</h4><span className="product-reviews-date">{review.date}</span><span className="product-reviews-verified">Acheteur vérifié</span></div>
                            <div className="product-reviews-rating-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "#FFC107" : "none"} color={i < review.rating ? "#FFC107" : "#ddd"} />)}
                            </div>
                        </div>
                        <p className="product-reviews-comment">"{review.comment}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviewsPage;
