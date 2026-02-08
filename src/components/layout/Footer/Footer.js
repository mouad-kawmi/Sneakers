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
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();
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
                            {t('footer.tagline')}
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-btn" aria-label={t('footer.social_fb')}><Facebook size={20} /></a>
                            <a href="#" className="footer-social-btn" aria-label={t('footer.social_ig')}><Instagram size={20} /></a>
                            <a href="#" className="footer-social-btn" aria-label={t('footer.social_tw')}><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-newsletter-container">
                        <h3 className="footer-section-title">{t('footer.newsletter_title')}</h3>
                        <p className="footer-newsletter-desc">{t('footer.newsletter_desc')}</p>
                        <div className="footer-input-wrapper">
                            <input
                                type="email"
                                placeholder={t('footer.email_placeholder')}
                                className="footer-newsletter-input"
                                aria-label={t('footer.newsletter_aria')}
                            />
                            <button className="footer-newsletter-btn" aria-label={t('footer.subscribe')}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-links-section">
                    <div className="footer-link-column">
                        <h4 className="footer-column-title">{t('footer.collections')}</h4>
                        <Link to={getCategoryPath('All')} className="footer-link">{t('footer.new_arrivals')}</Link>
                        <Link to={getCategoryPath('Nike')} className="footer-link">Nike Air</Link>
                        <Link to={getCategoryPath('Adidas')} className="footer-link">Adidas Boost</Link>
                        <Link to={getCategoryPath('New Balance')} className="footer-link">New Balance</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">{t('footer.help')}</h4>
                        <Link to={ROUTES.ABOUT} className="footer-link">{t('footer.about')}</Link>
                        <Link to={ROUTES.CONTACT} className="footer-link">{t('footer.contact_us')}</Link>
                        <Link to={`${ROUTES.HELP}?tab=delivery`} className="footer-link">{t('footer.delivery')}</Link>
                        <Link to={`${ROUTES.HELP}?tab=size-guide`} className="footer-link">{t('footer.size_guide')}</Link>
                        <Link to={ROUTES.TRACK_ORDER} className="footer-link">{t('footer.track_order')}</Link>
                        <Link to={ROUTES.FAQ} className="footer-link">{t('footer.faq')}</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">{t('footer.legal')}</h4>
                        <Link to={ROUTES.PRIVACY} className="footer-link">{t('footer.privacy')}</Link>
                        <Link to={ROUTES.TERMS} className="footer-link">{t('footer.terms')}</Link>
                    </div>

                    <div className="footer-link-column">
                        <h4 className="footer-column-title">{t('footer.contact')}</h4>
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
                    <p className="footer-copyright">{t('footer.copyright')}</p>
                    <button
                        onClick={scrollToTop}
                        className="footer-scroll-btn"
                        aria-label={t('footer.scroll_top')}
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
