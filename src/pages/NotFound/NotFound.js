import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="not-found-content"
                >
                    <div className="not-found-visual">
                        <div className="not-found-number">404</div>
                        <div className="not-found-circle"></div>
                    </div>

                    <h1 className="not-found-title">{t('not_found.title')}</h1>
                    <p className="not-found-text">
                        {t('not_found.text')}
                    </p>

                    <div className="not-found-actions">
                        <button
                            onClick={() => navigate('/')}
                            className="not-found-btn primary"
                        >
                            <Home size={18} /> {t('not_found.back_home')}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="not-found-btn secondary"
                        >
                            <ArrowLeft size={18} /> {t('not_found.back_prev')}
                        </button>
                    </div>

                    <div className="not-found-footer">
                        <p>{t('not_found.other_links')}</p>
                        <div className="suggestion-tags">
                            <button onClick={() => navigate('/category/Men')}>{t('not_found.men')}</button>
                            <button onClick={() => navigate('/category/Women')}>{t('not_found.women')}</button>
                            <button onClick={() => navigate('/category/Kids')}>{t('not_found.kids')}</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
