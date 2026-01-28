import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <img
            src={imgSrc || fallbackSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default ImageWithFallback;
