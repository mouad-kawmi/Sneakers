import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, LogIn } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login, register } from '../../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../../../context/ToastContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');

    const validateField = (name, value) => {
        let err = null;
        if (mode === 'register') {
            if (name === 'name' && !value) err = "Nom requis";
            if (name === 'email') {
                if (!value) err = "Email requis";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = "Email invalide";
            }
            if (name === 'password') {
                if (!value) err = "Mot de passe requis";
                else if (value.length < 6) err = "Min. 6 caractères";
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
                showToast(`Bon retour, ${user.name} !`, "success");
                onClose();
                if (user.role === 'admin') navigate('/admin');
            } else {
                setError('Identifiants incorrects.');
                showToast('Échec de la connexion', "error");
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
                showToast("Veuillez corriger les erreurs", "error");
                return;
            }

            if (users.find(u => u.email === email)) {
                setFieldErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé' }));
                showToast('Email déjà utilisé', "error");
                return;
            }

            dispatch(register({ name, email, password }));
            showToast("Compte créé avec succès ! Connectez-vous maintenant.", "success");
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
                            <h2 className="login-modal-title">{mode === 'login' ? 'Bienvenue' : 'Créer un compte'}</h2>
                            <p className="login-modal-subtitle">
                                {mode === 'login' ? 'Connectez-vous pour continuer' : 'Rejoignez la communauté Sberdila'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="login-modal-form">
                            {mode === 'register' && (
                                <div className="login-modal-input-group">
                                    <User size={20} className="login-modal-input-icon" />
                                    <input
                                        id="login-name"
                                        type="text"
                                        placeholder="Nom complet"
                                        value={name}
                                        onChange={(e) => handleInputChange('name', e.target.value, setName)}
                                        className={`login-modal-input ${fieldErrors.name ? 'error' : ''}`}
                                        aria-label="Nom complet"
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
                                    placeholder={mode === 'login' ? "Email ou Nom d'utilisateur" : "Email"}
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                                    className={`login-modal-input ${fieldErrors.email ? 'error' : ''}`}
                                    aria-label={mode === 'login' ? "Email ou Nom d'utilisateur" : "Email"}
                                    required
                                />
                                {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
                            </div>
                            <div className="login-modal-input-group">
                                <Lock size={20} className="login-modal-input-icon" />
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                                    className={`login-modal-input ${fieldErrors.password ? 'error' : ''}`}
                                    aria-label="Mot de passe"
                                    required
                                />
                                {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}
                            </div>
                            {error && <span className="login-modal-error">{error}</span>}
                            <button type="submit" className="btn-primary login-modal-submit-btn">
                                {mode === 'login' ? 'Se Connecter' : 'S\'inscrire'} <LogIn size={20} />
                            </button>
                        </form>

                        <div className="login-modal-divider">
                            <span>ou continuer avec</span>
                        </div>

                        <button className="google-login-btn" onClick={() => showToast("Connexion Google bientôt disponible", "info")}>
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
                                {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
                                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="login-modal-toggle-btn">
                                    {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
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
