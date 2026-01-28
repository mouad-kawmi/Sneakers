import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES, getCategoryPath } from '../../../constants/routes';
import {
    Facebook,
    Instagram,
    Twitter,
    Send,
    Smartphone,
    Mail,
    MapPin,
    ArrowUp
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-top-section">
                    <div className="footer-brand-container">
                        <h2 className="footer-logo">Sberdila<span style={{ color: 'var(--primary)' }}>.</span></h2>
                        <p className="footer-tagline">
                            La destination ultime pour les passionnés de sneakers.
                            Qualité premium, styles exclusifs et livraison rapide partout au Maroc.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-btn" aria-label="Suivez-nous sur Facebook"><Facebook size={20} /></a>
                            <a href="#" className="footer-social-btn" aria-label="Suivez-nous sur Instagram"><Instagram size={20} /></a>
                            <a href="#" className="footer-social-btn" aria-label="Suivez-nous sur Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-newsletter-container">
                        <h3 className="footer-section-title">Newsletter Excellence</h3>
                        <p className="footer-newsletter-desc">Abonnez-vous pour recevoir nos sorties exclusives et offres privilèges.</p>
                        <div className="footer-input-wrapper">
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="footer-newsletter-input"
                                aria-label="S'inscrire à la newsletter"
                            />
                            <button className="footer-newsletter-btn" aria-label="S'abonner">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-links-section">
                    <div className="footer-link-column">
                        <h4 className="footer-column-title">Collections</h4>
                        <Link to={getCategoryPath('All')} className="footer-link">Nouveautés</Link>
                        <Link to={getCategoryPath('Nike')} className="footer-link">Nike Air</Link>
                        <Link to={getCategoryPath('Adidas')} className="footer-link">Adidas Boost</Link>
                        <Link to={getCategoryPath('New Balance')} className="footer-link">New Balance</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">Aide & Support</h4>
                        <Link to={ROUTES.ABOUT} className="footer-link">À Propos</Link>
                        <Link to={ROUTES.CONTACT} className="footer-link">Nous contacter</Link>
                        <Link to={`${ROUTES.HELP}?tab=delivery`} className="footer-link">Livraison & Retours</Link>
                        <Link to={`${ROUTES.HELP}?tab=size-guide`} className="footer-link">Guide des tailles</Link>
                        <Link to={ROUTES.TRACK_ORDER} className="footer-link">Suivre ma commande</Link>
                        <Link to={ROUTES.FAQ} className="footer-link">FAQ</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">Légal</h4>
                        <Link to={ROUTES.PRIVACY} className="footer-link">Confidentialité</Link>
                        <Link to={ROUTES.TERMS} className="footer-link">Conditions de vente</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">Contact Direct</h4>
                        <div className="footer-contact-item">
                            <Smartphone size={16} color="var(--primary)" />
                            <span>+212 600 000 000</span>
                        </div>
                        <div className="footer-contact-item">
                            <Mail size={16} color="var(--primary)" />
                            <span>contact@sberdila.com</span>
                        </div>
                        <div className="footer-contact-item">
                            <MapPin size={16} color="var(--primary)" />
                            <span>Casablanca, Maroc</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-section">
                    <p className="footer-copyright">© 2024 Sberdila. Conçu avec passion pour la culture sneaker.</p>
                    <button
                        onClick={scrollToTop}
                        className="footer-scroll-btn"
                        aria-label="Retour en haut de la page"
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
