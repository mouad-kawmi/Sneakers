import React, { useState, useEffect, useRef } from 'react';
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
    const imgRef = useRef(null);

    // Initial check and reset when src changes
    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
        setIsLoaded(false);

        // If the image is already complete (e.g. from cache), trigger loaded state
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
            // Don't set isLoaded to true yet, wait for fallback to load
            // But if fallback or original is completely broken, we might want a timeout
        } else {
            // Even fallback failed
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
                ref={imgRef}
                src={imgSrc || fallbackSrc}
                alt={alt}
                onLoad={handleLoad}
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
