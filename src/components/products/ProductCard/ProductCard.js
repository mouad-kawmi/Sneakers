import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { useToast } from '../../../context/ToastContext';
import SmartImage from '../../layout/SmartImage/SmartImage';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    const hasDiscount = product.discount > 0;
    const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

    const sizes = product.sizes || [];
    const isTotalOutOfStock = sizes.length > 0 && sizes.every(s => s.stock === 0);

    const handleWishlist = (e) => {
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        showToast(
            isWishlisted ? "Retiré des favoris" : "Ajouté aux favoris",
            "notification",
            product.image
        );
    };

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="product-card"
        >
            <div className="product-card-badges">
                {product.isNew && <span className="product-badge product-badge-new">NOUVEAU</span>}
                {hasDiscount && <span className="product-badge product-badge-discount">-{product.discount}%</span>}
                {isTotalOutOfStock && <span className="product-badge product-badge-out">ÉPUISÉ</span>}
            </div>

            <button
                onClick={handleWishlist}
                className={`product-wishlist-btn btn-animate ${isWishlisted ? 'active' : 'inactive'}`}
                aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
                <Heart size={18} fill={isWishlisted ? "white" : "none"} />
            </button>

            <div className="product-image-wrapper">
                <SmartImage
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            </div>

            <div className="product-details">
                <h3 className="product-brand">{product.brand}</h3>
                <h2 className="product-name">{product.name}</h2>

                <div className="product-footer">
                    <div>
                        {hasDiscount && (
                            <span className="product-old-price">{product.price} DH</span>
                        )}
                        <span className="product-price">{finalPrice} DH</span>
                        <button
                            className="product-details-link btn-animate"
                            aria-label={`Voir les détails de ${product.name}`}
                        >
                            <Eye size={14} /> Voir détails
                        </button>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                        }}
                        className={`product-action-btn btn-animate ${isTotalOutOfStock ? 'out-stock' : 'in-stock'}`}
                        disabled={isTotalOutOfStock}
                        aria-label={isTotalOutOfStock ? "Produit épuisé" : "Choisir une taille"}
                    >
                        {isTotalOutOfStock ? 'Épuisé' : <><Plus size={20} /> Taille</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
