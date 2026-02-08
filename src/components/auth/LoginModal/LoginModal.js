import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, LogIn } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login, register } from '../../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');

    const validateField = (name, value) => {
        let err = null;
        if (mode === 'register') {
            if (name === 'name' && !value) err = t('auth.name_required');
            if (name === 'email') {
                if (!value) err = t('auth.email_required');
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = t('auth.email_invalid');
            }
            if (name === 'password') {
                if (!value) err = t('auth.password_required');
                else if (value.length < 6) err = t('auth.min_chars');
            }
        }
        return err;
    };

    const handleInputChange = (field, value, setter) => {
        setter(value);
        if (mode === 'register') {
            const err = validateField(field, value);
            setFieldErrors(prev => ({ ...prev, [field]: err }));
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { users } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            const user = users.find(u => (u.email === email || u.name === email) && u.password === password);
            if (user) {
                dispatch(login({ user }));
                showToast(t('auth.welcome_back', { name: user.name }), "success", null, t('auth.login').toUpperCase());
                onClose();
                if (user.role === 'admin') navigate('/admin');
            } else {
                setError(t('auth.login_error'));
                showToast(t('auth.login_failed'), "error", null, t('common.error').toUpperCase());
            }
        } else {
            // Register Mode
            const newFieldErrors = {
                name: validateField('name', name),
                email: validateField('email', email),
                password: validateField('password', password)
            };

            if (Object.values(newFieldErrors).some(err => err)) {
                setFieldErrors(newFieldErrors);
                showToast(t('auth.correct_errors'), "error", null, t('common.error').toUpperCase());
                return;
            }

            if (users.find(u => u.email === email)) {
                setFieldErrors(prev => ({ ...prev, email: t('auth.email_used') }));
                showToast(t('auth.email_used'), "error", null, t('common.error').toUpperCase());
                return;
            }

            dispatch(register({ name, email, password }));
            showToast(t('auth.account_created'), "success", null, t('auth.sign_up').toUpperCase());
            setMode('login');
            setPassword('');
            setFieldErrors({});
            setError('');
        }
    };

    const content = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="login-modal-backdrop" />
                    <motion.div initial={{ opacity: 0, x: '-50%', y: '-40%', scale: 0.9 }} animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }} exit={{ opacity: 0, x: '-50%', y: '-40%', scale: 0.9 }} className="login-modal">
                        <button onClick={onClose} className="login-modal-close-btn"><X size={24} /></button>
                        <div className="login-modal-header">
                            <div className="login-modal-icon-container">
                                {mode === 'login' ? <Lock size={24} color="var(--primary)" /> : <User size={24} color="var(--primary)" />}
                            </div>
                            <h2 className="login-modal-title">{mode === 'login' ? t('auth.welcome_title') : t('auth.create_account')}</h2>
                            <p className="login-modal-subtitle">
                                {mode === 'login' ? t('auth.login_subtitle') : t('auth.join_community')}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="login-modal-form">
                            {mode === 'register' && (
                                <div className="login-modal-input-group">
                                    <User size={20} className="login-modal-input-icon" />
                                    <input
                                        id="login-name"
                                        type="text"
                                        placeholder={t('auth.full_name')}
                                        value={name}
                                        onChange={(e) => handleInputChange('name', e.target.value, setName)}
                                        className={`login-modal-input ${fieldErrors.name ? 'error' : ''}`}
                                        aria-label={t('auth.full_name')}
                                        required
                                    />
                                    {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                                </div>
                            )}
                            <div className="login-modal-input-group">
                                <User size={20} className="login-modal-input-icon" />
                                <input
                                    id="login-email"
                                    type={mode === 'login' ? 'text' : 'email'}
                                    placeholder={mode === 'login' ? t('auth.email_or_user') : t('auth.email_required')}
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                                    className={`login-modal-input ${fieldErrors.email ? 'error' : ''}`}
                                    aria-label={mode === 'login' ? t('auth.email_or_user') : t('auth.email_required')}
                                    required
                                />
                                {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
                            </div>
                            <div className="login-modal-input-group">
                                <Lock size={20} className="login-modal-input-icon" />
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder={t('auth.password')}
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                                    className={`login-modal-input ${fieldErrors.password ? 'error' : ''}`}
                                    aria-label={t('auth.password')}
                                    required
                                />
                                {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}
                            </div>
                            {error && <span className="login-modal-error">{error}</span>}
                            <button type="submit" className="btn-primary login-modal-submit-btn">
                                {mode === 'login' ? t('auth.login_btn') : t('auth.register_btn')} <LogIn size={20} />
                            </button>
                        </form>

                        <div className="login-modal-divider">
                            <span>{t('auth.or_continue')}</span>
                        </div>

                        <button className="google-login-btn" onClick={() => showToast(t('auth.google_soon'), "info")}>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <div className="login-modal-footer">
                            <p>
                                {mode === 'login' ? t('auth.no_account') : t('auth.have_account')}
                                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="login-modal-toggle-btn">
                                    {mode === 'login' ? t('auth.register_btn') : t('auth.login_btn')}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(content, document.body);
};

export default LoginModal;
