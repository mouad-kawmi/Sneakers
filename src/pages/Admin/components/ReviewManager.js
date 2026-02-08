import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Trash2, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteReview, toggleFeatured } from '../../../store/slices/reviewSlice';

const ReviewManager = ({ reviews, products }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const getProductName = (id) => {
        const product = products.find(p => p.id === id);
        return product ? product.name : t('admin.unknown_product');
    };

    // Filters & Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const reviewsPerPage = 10;

    const filters = [
        { id: 'all', label: t('orders.all') },
        { id: 'featured', label: t('admin.featured') },
        { id: 'recent', label: t('admin.date') },
        { id: 'top', label: '5 ★' },
        { id: 'critical', label: '≤ 2 ★' }
    ];

    // 1. Apply Search & Status Filter
    const filteredReviews = reviews.slice().reverse().filter(review => {
        // Search Filter
        const productName = getProductName(review.productId).toLowerCase();
        const customerName = review.userName.toLowerCase();
        const comment = review.comment.toLowerCase();
        const matchesSearch = customerName.includes(searchQuery.toLowerCase()) ||
            productName.includes(searchQuery.toLowerCase()) ||
            comment.includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Status/Category Filter
        if (activeFilter === 'featured') return review.isFeatured;
        if (activeFilter === 'top') return review.rating === 5;
        if (activeFilter === 'critical') return review.rating <= 2;
        if (activeFilter === 'recent') {
            const reviewDate = new Date(review.date);
            const now = new Date();
            const diffDays = Math.ceil((now - reviewDate) / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        }

        return true;
    });

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1);
    };

    return (
        <div className="admin-section">
            <div className="admin-orders-header">
                <div className="admin-orders-top">
                    <h2 className="admin-section-title">{t('admin.customer_reviews')}</h2>
                    <div className="admin-order-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                <div className="admin-presets-scroll">
                    <div className="admin-preset-tabs">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                className={`preset-tab ${activeFilter === f.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-wrapper hide-mobile-flex">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="admin-th">{t('admin.customer')}</th>
                            <th className="admin-th">{t('admin.product')}</th>
                            <th className="admin-th">{t('admin.rating')}</th>
                            <th className="admin-th">{t('admin.comment')}</th>
                            <th className="admin-th">{t('admin.date')}</th>
                            <th className="admin-th">{t('admin.featured')}</th>
                            <th className="admin-th">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReviews.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                                    {t('admin.no_results_found')}
                                </td>
                            </tr>
                        ) : (
                            currentReviews.map(review => (
                                <tr key={review.id}>
                                    <td className="admin-td" style={{ fontWeight: 600 }}>{review.userName}</td>
                                    <td className="admin-td" style={{ fontSize: '13px' }}>{getProductName(review.productId)}</td>
                                    <td className="admin-td">
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "#FFC107" : "none"} color="#FFC107" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="admin-td" style={{ maxWidth: '300px', fontSize: '13px', color: 'var(--text-gray)' }}>
                                        {review.comment}
                                    </td>
                                    <td className="admin-td" style={{ fontSize: '12px' }}>{review.date}</td>
                                    <td className="admin-td">
                                        <button
                                            onClick={() => dispatch(toggleFeatured(review.id))}
                                            className={`review-featured-btn ${review.isFeatured ? 'featured' : ''}`}
                                        >
                                            {review.isFeatured ? `★ ${t('admin.featured')}` : t('admin.not_featured')}
                                        </button>
                                    </td>
                                    <td className="admin-td">
                                        <button onClick={() => {
                                            if (window.confirm(t('admin.delete_review_confirm'))) dispatch(deleteReview(review.id))
                                        }} className="admin-action-btn delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="admin-mobile-cards show-mobile">
                {currentReviews.length === 0 ? (
                    <div className="admin-empty-text">{t('admin.no_results_found')}</div>
                ) : (
                    currentReviews.map(review => (
                        <div key={review.id} className={`admin-mobile-card review-card ${review.isFeatured ? 'featured' : ''}`}>
                            <div className="admin-mobile-card-top">
                                <div className="admin-mobile-card-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 className="admin-mobile-card-name">{review.userName}</h4>
                                        <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{review.date}</span>
                                    </div>
                                    <p className="admin-mobile-card-brand" style={{ marginBottom: '8px' }}>{getProductName(review.productId)}</p>
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "#FFC107" : "none"} color="#FFC107" />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0', lineHeight: '1.4', wordBreak: 'break-word' }}>
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                            <div className="admin-mobile-card-actions">
                                <button
                                    onClick={() => dispatch(toggleFeatured(review.id))}
                                    className={`admin-mobile-action-btn ${review.isFeatured ? 'featured' : ''}`}
                                    style={{
                                        background: review.isFeatured ? 'rgba(46, 213, 115, 0.1)' : 'var(--bg-app)',
                                        color: review.isFeatured ? '#2ED573' : 'var(--text-gray)'
                                    }}
                                >
                                    <Star size={16} fill={review.isFeatured ? "#2ED573" : "none"} />
                                    {review.isFeatured ? t('admin.featured') : t('admin.not_featured')}
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(t('admin.delete_review_confirm'))) dispatch(deleteReview(review.id))
                                    }}
                                    className="admin-mobile-action-btn delete"
                                >
                                    <Trash2 size={16} /> {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-btn"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="pagination-numbers">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-btn"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewManager;

