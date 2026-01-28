import React from 'react';
import Skeleton from '../../layout/Skeleton/Skeleton';
import './ProductCardSkeleton.css';

export const ProductCardSkeleton = () => {
    return (
        <div className="product-skeleton-card">
            {/* Image Placeholder */}
            <div className="product-skeleton-image-wrapper">
                <Skeleton height="100%" borderRadius="16px" />
            </div>

            <div className="product-skeleton-details">
                {/* Brand */}
                <Skeleton width="40%" height="12px" className="mb-8" />

                {/* Name */}
                <Skeleton width="85%" height="18px" className="mb-12" />

                <div className="product-skeleton-footer">
                    <div className="product-skeleton-price-box">
                        <Skeleton width="60px" height="20px" />
                    </div>
                    <Skeleton width="80px" height="35px" borderRadius="10px" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
