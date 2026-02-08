import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Check } from 'lucide-react';
import './MobileSelect.css';

const MobileSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Sélectionner",
    required = false,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Find selected label because value is usually an ID or key
    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayValue = selectedOption ? (selectedOption.label || selectedOption.name || selectedOption.value) : '';

    const handleSelect = (selectedValue) => {
        // Create a fake event object to maintain compatibility with standard React handlers
        const event = {
            target: {
                value: selectedValue,
                name: label // optional, helps if handler uses name
            },
            preventDefault: () => { }
        };
        onChange(event);
        setIsOpen(false);
    };

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMobile]);

    if (!isMobile) {
        return (
            <div className={`mobile-select-container ${className}`}>
                {label && <label className="admin-label">{label}</label>}
                <select
                    className="admin-input"
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label || opt.name || opt.value}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className={`mobile-select-container ${className}`}>
            {label && <label className="admin-label">{label}</label>}

            <div
                className={`admin-input mobile-select-trigger ${!value ? 'placeholder' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <span>{displayValue || placeholder}</span>
                <ChevronDown size={18} className="text-gray-400" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mobile-select-backdrop"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="mobile-select-sheet"
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, info) => {
                                if (info.offset.y > 100) setIsOpen(false);
                            }}
                        >
                            <div className="mobile-select-header">
                                <h3>{label || placeholder}</h3>
                                <button onClick={() => setIsOpen(false)} className="close-btn" type="button">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mobile-select-options">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`mobile-select-option ${String(value) === String(opt.value) ? 'selected' : ''}`}
                                        onClick={() => handleSelect(opt.value)}
                                    >
                                        <span>{opt.label || opt.name || opt.value}</span>
                                        {String(value) === String(opt.value) && <Check size={18} className="check-icon" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileSelect;
