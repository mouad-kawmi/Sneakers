import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Eye, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { useToast } from '../../../context/ToastContext';
import SmartImage from '../../layout/SmartImage/SmartImage';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    const hasDiscount = product.discount > 0 && (!product.discountEndTime || new Date(product.discountEndTime) > new Date());
    const finalPrice = hasDiscount ? Math.floor(product.price * (1 - product.discount / 100)) : product.price;

    const sizes = product.sizes || [];
    const isTotalOutOfStock = sizes.length > 0 && sizes.every(s => s.stock === 0);

    const handleWishlist = (e) => {
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        showToast(
            isWishlisted ? t('product.removed_wishlist') : t('product.added_wishlist'),
            "notification",
            product.image,
            t('common.wishlist').toUpperCase()
        );
    };

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="product-card"
        >
            <div className="product-card-badges">
                {product.isNew && <span className="product-badge product-badge-new">{t('product.new')}</span>}
                {hasDiscount && <span className="product-badge product-badge-discount">-{product.discount}%</span>}
                {isTotalOutOfStock && <span className="product-badge product-badge-out">{t('product.out_stock')}</span>}
            </div>

            <button
                onClick={handleWishlist}
                className={`product-wishlist-btn btn-animate ${isWishlisted ? 'active' : 'inactive'}`}
                aria-label={isWishlisted ? t('product.removed_wishlist') : t('product.added_wishlist')}
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
                    <div className="product-price-box">
                        {hasDiscount && (
                            <span className="product-old-price">{product.price} DH</span>
                        )}
                        <span className="product-price">{finalPrice} DH</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                        }}
                        className={`product-action-btn btn-animate ${isTotalOutOfStock ? 'out-stock' : 'in-stock'}`}
                        disabled={isTotalOutOfStock}
                        aria-label={isTotalOutOfStock ? t('product.out_stock') : t('common.buy')}
                    >
                        {isTotalOutOfStock ? t('product.out_stock') : <><ShoppingBag size={18} /> {t('common.buy')}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
