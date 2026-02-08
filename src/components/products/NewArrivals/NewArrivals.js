import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../../store/slices/cartSlice';
import RevealOnScroll from '../../RevealOnScroll/RevealOnScroll';
import './NewArrivals.css';

const ProductCard = lazy(() => import('../ProductCard/ProductCard'));
const ProductCardSkeleton = lazy(() => import('../ProductCard/ProductCardSkeleton'));

const NewArrivals = () => {
    const { t } = useTranslation();
    const products = useSelector((state) => state.products?.items || []);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const recentProducts = products.slice(0, 4);

    if (!isLoading && recentProducts.length === 0) return null;

    return (
        <div className="new-arrivals-section">
            <div className="new-arrivals-header">
                <h2 className="new-arrivals-title">{t('footer.new_arrivals')}</h2>
                <div className="new-arrivals-divider"></div>
            </div>

            <div className="new-arrivals-grid">
                <Suspense fallback={null}>
                    {isLoading ? (
                        [...Array(4)].map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))
                    ) : (
                        recentProducts.map((product, index) => (
                            <RevealOnScroll
                                key={product.id}
                                delay={index * 0.1}
                                direction="up"
                                className="product-card-reveal-wrapper"
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={(p) => dispatch(addToCart(p))}
                                />
                            </RevealOnScroll>
                        ))
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default NewArrivals;
