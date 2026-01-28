import React from 'react';
import Skeleton from '../../components/layout/Skeleton/Skeleton';
import './ProductDetailsSkeleton.css';

const ProductDetailsSkeleton = () => {
    return (
        <div className="container product-details-page skeleton-details">
            {/* Top Navigation Skeleton */}
            <div className="product-details-nav">
                <Skeleton width="40px" height="40px" borderRadius="12px" />
                <div className="product-details-actions">
                    <Skeleton width="40px" height="40px" borderRadius="12px" className="ml-12" />
                    <Skeleton width="40px" height="40px" borderRadius="12px" className="ml-12" />
                </div>
            </div>

            <div className="product-details-grid">
                {/* Image Section Skeleton */}
                <div className="product-details-image-section">
                    <div className="product-details-main-img-container">
                        <Skeleton height="100%" borderRadius="24px" />
                    </div>
                    <div className="product-details-thumbnails">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="product-details-thumbnail-btn">
                                <Skeleton width="100%" height="100%" borderRadius="12px" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section Skeleton */}
                <div className="product-details-info">
                    <Skeleton width="100px" height="24px" borderRadius="20px" className="mb-12" />
                    <Skeleton width="80%" height="40px" className="mb-16" />

                    <div className="product-details-rating-row mb-24">
                        <Skeleton width="120px" height="20px" />
                        <Skeleton width="100px" height="20px" className="ml-12" />
                    </div>

                    <div className="product-details-price-section mb-32">
                        <Skeleton width="150px" height="36px" />
                        <Skeleton width="100px" height="24px" className="ml-16" />
                    </div>

                    {/* Size Selector Skeleton */}
                    <div className="product-details-selector mb-32">
                        <div className="product-details-selector-header mb-12">
                            <Skeleton width="120px" height="20px" />
                            <Skeleton width="80px" height="20px" />
                        </div>
                        <div className="product-details-size-grid">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} width="60px" height="50px" borderRadius="12px" />
                            ))}
                        </div>
                    </div>

                    {/* Action Button Skeleton */}
                    <Skeleton width="100%" height="60px" borderRadius="16px" className="mb-32" />

                    {/* Benefits Skeleton */}
                    <div className="product-details-benefits mb-32">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} width="140px" height="24px" />
                        ))}
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="product-details-tabs">
                        <div className="product-details-tab-header mb-16">
                            <Skeleton width="100px" height="30px" />
                            <Skeleton width="120px" height="30px" className="ml-16" />
                        </div>
                        <Skeleton width="100%" height="100px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
