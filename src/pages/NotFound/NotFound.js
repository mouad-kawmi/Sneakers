import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
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

                    <h1 className="not-found-title">Oops! Page introuvable</h1>
                    <p className="not-found-text">
                        La page que vous recherchez semble avoir pris la fuite.
                        Elle est peut-être déjà en train de courir avec une nouvelle paire de sneakers !
                    </p>

                    <div className="not-found-actions">
                        <button
                            onClick={() => navigate('/')}
                            className="not-found-btn primary"
                        >
                            <Home size={18} /> Retour à l'accueil
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="not-found-btn secondary"
                        >
                            <ArrowLeft size={18} /> Page précédente
                        </button>
                    </div>

                    <div className="not-found-footer">
                        <p>D'autres liens utiles :</p>
                        <div className="suggestion-tags">
                            <button onClick={() => navigate('/category/Men')}>Hommes</button>
                            <button onClick={() => navigate('/category/Women')}>Femmes</button>
                            <button onClick={() => navigate('/category/Kids')}>Enfants</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
