import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addMessage } from '../../store/slices/messageSlice';
import { useToast } from '../../context/ToastContext';
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'name':
                if (!value) error = t('contact.error_name_req');
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('contact.error_email_inv');
                break;
            case 'subject':
                if (!value) error = t('contact.error_sub_req');
                break;
            case 'message':
                if (value.length < 10) error = t('contact.error_msg_len');
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        const fieldError = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final validation
        const newErrors = {};
        Object.keys(formState).forEach(key => {
            const err = validateField(key, formState[key]);
            if (err) newErrors[key] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast(t('contact.error_correct'), "error", null, t('common.error').toUpperCase());
            return;
        }

        dispatch(addMessage(formState));
        setIsSubmitted(true);
        showToast(t('contact.msg_success'), "success", null, t('contact.title').toUpperCase());
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormState({ name: '', email: '', subject: '', message: '' });
        setErrors({});
    };

    const contactInfo = [
        {
            icon: <Mail size={24} />,
            title: t('contact.info_email'),
            value: "contact@sberdila.com",
            link: "mailto:contact@sberdila.com",
            color: "#9333EA"
        },
        {
            icon: <Phone size={24} />,
            title: t('contact.info_phone'),
            value: "+212 600 000 000",
            link: "tel:+212600000000",
            color: "#2ED573"
        },
        {
            icon: <MapPin size={24} />,
            title: t('contact.info_address'),
            value: "Casablanca, Maroc",
            link: "#",
            color: "#FF4757"
        }
    ];

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="contact-hero-content"
                    >
                        <span className="contact-badge">{t('contact.title')}</span>
                        <h1 className="contact-hero-title">
                            {t('contact.hero_title')} <span className="text-gradient">{t('contact.hero_title_span')}</span>
                        </h1>
                        <p className="contact-hero-sub">
                            {t('contact.hero_subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="contact-main-content">
                <div className="container">
                    <div className="contact-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="contact-info-col"
                        >
                            <div className="contact-info-cards">
                                {contactInfo.map((info, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={info.link}
                                        className="contact-info-card"
                                    >
                                        <div className="contact-icon-box" style={{ backgroundColor: `${info.color}15`, color: info.color }}>
                                            {info.icon}
                                        </div>
                                        <div className="contact-info-text">
                                            <h3 className="contact-info-title">{info.title}</h3>
                                            <p className="contact-info-value">{info.value}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>

                            <div className="contact-social-box">
                                <h3 className="contact-social-label">{t('contact.follow_us')}</h3>
                                <div className="contact-social-icons">
                                    {[{ icon: <Instagram />, label: "Instagram" }, { icon: <Twitter />, label: "Twitter" }, { icon: <Facebook />, label: "Facebook" }].map((item, i) => (
                                        <motion.button
                                            key={i}
                                            className="contact-social-btn"
                                            aria-label={t('contact.follow_us_social', { label: item.label })}
                                        >
                                            {React.cloneElement(item.icon, { size: 20 })}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="contact-form-col"
                        >
                            <div className="contact-form-container">
                                <div className="contact-form-header">
                                    <MessageSquare size={24} color="var(--primary)" />
                                    <h2 className="contact-form-title">{t('contact.send_message')}</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="contact-form-row">
                                        <div className="contact-input-group">
                                            <label htmlFor="contact-name" className="contact-label">{t('contact.full_name')}</label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                type="text"
                                                placeholder={t('contact.placeholder_name')}
                                                required
                                                className={`contact-input ${errors.name ? 'error' : ''}`}
                                                value={formState.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <span className="error-text">{errors.name}</span>}
                                        </div>
                                        <div className="contact-input-group">
                                            <label htmlFor="contact-email" className="contact-label">{t('profile.email')}</label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                placeholder={t('contact.placeholder_email')}
                                                required
                                                className={`contact-input ${errors.email ? 'error' : ''}`}
                                                value={formState.email}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <span className="error-text">{errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="contact-input-group">
                                        <label htmlFor="contact-subject" className="contact-label">{t('contact.subject')}</label>
                                        <input
                                            id="contact-subject"
                                            name="subject"
                                            type="text"
                                            placeholder={t('contact.placeholder_subject')}
                                            required
                                            className={`contact-input ${errors.subject ? 'error' : ''}`}
                                            value={formState.subject}
                                            onChange={handleInputChange}
                                        />
                                        {errors.subject && <span className="error-text">{errors.subject}</span>}
                                    </div>

                                    <div className="contact-input-group">
                                        <label htmlFor="contact-message" className="contact-label">{t('contact.message')}</label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows="5"
                                            placeholder={t('contact.placeholder_message')}
                                            required
                                            className={`contact-input ${errors.message ? 'error' : ''}`}
                                            style={{ resize: 'none' }}
                                            value={formState.message}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        {errors.message && <span className="error-text">{errors.message}</span>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitted}
                                        className="contact-submit-btn"
                                    >
                                        {isSubmitted ? (
                                            <>{t('contact.sent')}</>
                                        ) : (
                                            <><Send size={18} /> {t('contact.send_btn')}</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
