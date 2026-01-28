import React, { useState } from 'react';
import Skeleton from '../Skeleton/Skeleton';
import './SmartImage.css';

const SmartImage = ({ src, alt = "Sneaker Sberdila", className = '', ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className={`smart-image-container ${isLoaded ? 'loaded' : 'loading'} ${className}`}
            role="img"
            aria-label={alt}
        >
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                decoding="async"
                className={`smart-image-img ${isLoaded ? 'visible' : 'hidden'}`}
                {...props}
            />
            {!isLoaded && (
                <div className="smart-image-placeholder" aria-hidden="true">
                    <Skeleton height="100%" borderRadius="inherit" />
                </div>
            )}
        </div>
    );
};

export default SmartImage;
