import React from 'react';
import { motion } from 'framer-motion';
import './EmptyState.css';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    ctaText,
    onCtaClick,
    className = ''
}) => {
    return (
        <div className={`empty-state-container ${className}`}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="empty-state-content"
            >
                {Icon && (
                    <div className="empty-state-icon-wrapper">
                        <Icon size={64} strokeWidth={1.5} />
                    </div>
                )}

                <h3 className="empty-state-title">{title}</h3>

                {description && (
                    <p className="empty-state-description">{description}</p>
                )}

                {ctaText && (
                    <button
                        onClick={onCtaClick}
                        className="empty-state-cta-btn"
                    >
                        {ctaText}
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default EmptyState;
