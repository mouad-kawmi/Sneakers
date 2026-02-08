import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success', image = null, title = null) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, image, title }]);
        setTimeout(() => removeToast(id), 2000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, image, title, onClose }) => {
    const { t } = useTranslation();
    const getDisplayText = () => {
        if (title) return title;
        if (type === 'success') return t('common.success');
        if (type === 'error') return t('common.error');
        return t('common.notification');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
            layout
            className="toast-item btn-animate"
            data-testid="success-toast"
        >
            {image ? (
                <div className="toast-img-wrapper">
                    <img src={image} alt="" className="toast-img" />
                </div>
            ) : (
                <div className="toast-icon-wrapper">
                    <CheckCircle2 size={20} color="#2ED573" />
                </div>
            )}
            <div className="toast-content">
                <h4 className="toast-title">{getDisplayText()}</h4>
                <p className="toast-message">{message}</p>
            </div>
            <button onClick={onClose} className="toast-close-btn"><X size={16} /></button>

            {/* Progress Bar Animation */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="toast-progress-bar"
            />
        </motion.div>
    );
};

export default ToastContext;
