import React, { useState, useEffect } from 'react';
import Skeleton from '../Skeleton/Skeleton';
import './SmartImage.css';

const SmartImage = ({
    src,
    alt = "Sneaker Sberdila",
    className = '',
    priority = false,
    fallbackSrc = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=60&w=400&auto=format&fit=crop',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Reset state when src changes
        setImgSrc(src);
        setHasError(false);
        setIsLoaded(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
            // We set isLoaded to true here to remove the skeleton 
            // so the user can see the fallback or alt text
            setIsLoaded(true);
        }
    };

    return (
        <div
            className={`smart-image-container ${isLoaded ? 'loaded' : 'loading'} ${className}`}
            role="img"
            aria-label={alt}
        >
            <img
                src={imgSrc || fallbackSrc}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "low"}
                decoding={priority ? "sync" : "async"}
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
