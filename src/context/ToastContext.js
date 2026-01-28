import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', image = null) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, image }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={styles.toastContainer}>
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, image, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
        layout
        style={styles.toast}
        className="btn-animate"
        data-testid="success-toast"
    >
        {image ? (
            <div style={styles.imgWrapper}>
                <img src={image} alt="" style={styles.img} />
            </div>
        ) : (
            <div style={styles.iconWrapper}>
                <CheckCircle2 size={20} color="#2ED573" />
            </div>
        )}
        <div style={styles.content}>
            <h4 style={styles.title}>{type === 'success' ? 'Ajouté au panier' : 'Notification'}</h4>
            <p style={styles.message}>{message}</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}><X size={16} /></button>

        {/* Progress Bar Animation */}
        <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            style={styles.progressBar}
        />
    </motion.div>
);

const styles = {
    toastContainer: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
    },
    toast: {
        pointerEvents: 'auto',
        background: 'rgba(var(--bg-card-rgb), 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        minWidth: '340px',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden'
    },
    imgWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
    },
    iconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(46, 213, 115, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: '85%',
        height: '85%',
        objectFit: 'contain'
    },
    content: { flex: 1 },
    title: { fontSize: '13px', fontWeight: '800', margin: '0 0 2px 0', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' },
    message: { fontSize: '14px', color: 'var(--text-gray)', margin: 0, fontWeight: '600', lineHeight: 1.3 },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-gray)',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'all 0.2s',
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        background: 'var(--primary)',
        boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
    }
};

export default ToastContext;
