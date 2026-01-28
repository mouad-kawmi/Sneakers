import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Star } from 'lucide-react';
import { deleteReview, toggleFeatured } from '../../../store/slices/reviewSlice';

const ReviewManager = ({ reviews, products }) => {
    const dispatch = useDispatch();

    const getProductName = (id) => {
        const product = products.find(p => p.id === id);
        return product ? product.name : "Produit Inconnu";
    };

    return (
        <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="admin-section-title">Gestion des Avis Clients</h2>
            </div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="admin-th">Client</th>
                            <th className="admin-th">Produit</th>
                            <th className="admin-th">Note</th>
                            <th className="admin-th">Commentaire</th>
                            <th className="admin-th">Date</th>
                            <th className="admin-th">Mise en avant</th>
                            <th className="admin-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.slice().reverse().map(review => (
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
                                        {review.isFeatured ? "★ En avant" : "Griser"}
                                    </button>
                                </td>
                                <td className="admin-td">
                                    <button onClick={() => {
                                        if (window.confirm('Supprimer cet avis ?')) dispatch(deleteReview(review.id))
                                    }} className="admin-action-btn" style={{ color: 'red', background: '#ffebee' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewManager;
