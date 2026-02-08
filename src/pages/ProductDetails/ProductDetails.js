import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    ArrowLeft,
    Star,
    Truck,
    ShieldCheck,
    RotateCcw,
    Heart,
    Share2,
    Check
} from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { openCart } from '../../store/slices/uiSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import ProductReviews from '../../components/products/ProductReviews/ProductReviews';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/layout/SEO/SEO';
import SmartImage from '../../components/layout/SmartImage/SmartImage';
import ProductDetailsSkeleton from './ProductDetailsSkeleton';
import './ProductDetails.css';

const ProductCard = React.lazy(() => import('../../components/products/ProductCard/ProductCard'));

const ProductDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const products = useSelector((state) => state.products?.items || []);
    const product = Array.isArray(products) ? products.find((p) => p.id === parseInt(id)) : null;

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(
        product ? (product.image || (product.images && product.images[0])) : null
    );

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image || (product.images && product.images[0]));
        }
    }, [product]);

    // Simplified: Only showing description now, no need for activeTab
    const [addedToCart, setAddedToCart] = useState(false);

    const { showToast } = useToast();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isLiked = product && wishlistItems.some(item => item.id === product.id);

    const reviews = useSelector(state => state.reviews?.items || []);
    const productReviews = Array.isArray(reviews) ? reviews.filter(r => r.productId === parseInt(id)) : [];
    const averageRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : 0;

    useEffect(() => {
        window.scrollTo(0, 0);
        // Simulate loading
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [id]);

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className="container product-not-found">
                <h2>{t('product.not_found')}</h2>
                <button onClick={() => navigate('/')} className="back-home-btn">{t('product.back_home')}</button>
            </div>
        );
    }

    const sizes = product.sizes || [];
    const selectedSizeData = sizes.find(s => s.size === selectedSize);
    const isOutOfStock = selectedSizeData && selectedSizeData.stock === 0;

    const handleAddToCart = () => {
        if (!selectedSize || isOutOfStock) return;
        dispatch(addToCart({ product, size: selectedSize }));
        dispatch(openCart());
        setAddedToCart(true);
        showToast(t('common.added_to_cart'), "success", product.image, t('common.cart').toUpperCase());
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const relatedProducts = products
        .filter(p => p.brand === product.brand && p.id !== product.id)
        .slice(0, 4);

    const description = t('product.default_description');

    return (
        <div className="container product-details-page">
            <SEO
                title={product.name}
                description={product.description || description}
                image={product.image}
                type="product"
            />
            <div className="product-details-nav">
                <button onClick={() => navigate(-1)} className="product-details-icon-btn"><ArrowLeft size={20} /></button>
                <div className="product-details-actions">
                    <button
                        onClick={() => {
                            dispatch(toggleWishlist(product));
                            showToast(
                                isLiked ? t('product.removed_wishlist') : t('product.added_wishlist'),
                                "notification",
                                product.image,
                                t('common.wishlist').toUpperCase()
                            );
                        }}
                        className="product-details-icon-btn"
                        style={{ color: isLiked ? '#FF4757' : 'var(--text-main)' }}
                        aria-label={isLiked ? t('nav.remove_wishlist') : t('nav.add_wishlist')}
                    >
                        <Heart size={20} fill={isLiked ? '#FF4757' : 'none'} />
                    </button>
                    <button className="product-details-icon-btn" aria-label={t('common.share')}><Share2 size={20} /></button>
                </div>
            </div>

            <div className="product-details-grid">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="product-details-image-section">
                    <div className="product-details-main-img-container">
                        <SmartImage src={selectedImage || product.image} alt={product.name} className="product-details-main-img" />
                    </div>
                    {/* Gallery Thumbnails */}
                    {(product.images && product.images.length > 0) && (
                        <div className="product-details-thumbnails">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`product-details-thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                                >
                                    <SmartImage src={img} alt={`${product.name} ${index + 1}`} className="product-details-thumbnail-img" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="product-details-info">
                    <div className="product-details-brand-badge">{product.brand}</div>
                    <h1 className="product-details-title">{product.name}</h1>
                    <div className="product-details-rating-row">
                        <div className="product-details-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.round(averageRating || 5) ? "#FFD32A" : "none"}
                                    color="#FFD32A"
                                />
                            ))}
                        </div>
                        <span className="product-details-review-count">({averageRating || "5.0"}/5 • {productReviews.length || 0} {t('product.reviews')})</span>
                        <button
                            onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="product-details-inline-review-btn"
                        >
                            {t('product.give_review')}
                        </button>
                    </div>

                    <div className="product-details-price-section">
                        {product.discount > 0 && (!product.discountEndTime || new Date(product.discountEndTime) > new Date()) ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <span className="product-details-price">{Math.floor(product.price * (1 - product.discount / 100))} DH</span>
                                    <span style={{
                                        fontSize: '18px',
                                        color: 'var(--text-gray)',
                                        textDecoration: 'line-through',
                                        fontWeight: '500'
                                    }}>{product.price} DH</span>
                                    <span style={{
                                        background: '#FF4757',
                                        color: '#fff',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '800'
                                    }}>-{product.discount}%</span>
                                </div>
                            </>
                        ) : (
                            <span className="product-details-price">{product.price} DH</span>
                        )}
                        <span className={`product-details-stock-status ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                            {isOutOfStock ? t('product.out_of_stock') : t('product.in_stock')}
                        </span>
                    </div>

                    <div className="product-details-selector">
                        <div className="product-details-selector-header">
                            <span className="product-details-selector-title">{t('product.choose_size')}</span>
                            <button className="product-details-guide-btn">{t('product.size_guide')}</button>
                        </div>
                        <div className="product-details-size-grid">
                            {sizes.map((item) => (
                                <button
                                    key={item.size}
                                    onClick={() => setSelectedSize(item.size)}
                                    className={`product-details-size-chip ${selectedSize === item.size ? 'active' : ''} ${item.stock === 0 ? 'out-of-stock' : ''}`}
                                    disabled={item.stock === 0}
                                >
                                    {item.size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-details-action-section">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize || isOutOfStock}
                            className={`product-details-add-to-cart ${!selectedSize ? 'no-size' : (isOutOfStock ? 'out-of-stock' : (addedToCart ? 'added' : 'ready'))}`}
                        >
                            {!selectedSize ? t('product.please_choose_size') : (isOutOfStock ? t('product.out_of_stock') : (addedToCart ? <><Check size={20} /> {t('product.added')}</> : <><ShoppingBag size={20} /> {t('cart.add')}</>))}
                        </button>
                    </div>

                    <div className="product-details-benefits">
                        <div className="product-details-benefit-item"><Truck size={18} color="var(--primary)" /><span>{t('product.free_shipping')}</span></div>
                        <div className="product-details-benefit-item"><ShieldCheck size={18} color="var(--primary)" /><span>{t('product.original_guarantee')}</span></div>
                        <div className="product-details-benefit-item"><RotateCcw size={18} color="var(--primary)" /><span>{t('product.return_policy')}</span></div>
                    </div>

                    <div className="product-details-content-section">
                        <h3 className="product-details-content-title">{t('product.description')}</h3>
                        <p className="product-details-description">{product.description || description}</p>
                    </div>
                </motion.div>
            </div>

            <div id="reviews-section">
                <ProductReviews productId={parseInt(id)} />
            </div>

            {relatedProducts.length > 0 && (
                <div className="product-details-related">
                    <h2 className="product-details-section-title">{t('product.related_products')}</h2>
                    <div className="related-grid">
                        <React.Suspense fallback={null}>
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </React.Suspense>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
