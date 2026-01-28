import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../store/slices/messageSlice';
import { useToast } from '../../context/ToastContext';
import './Contact.css';

const Contact = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addMessage(formState));
        setIsSubmitted(true);
        showToast("Message envoyé avec succès !", "success");
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <Mail size={24} />,
            title: "Email",
            value: "contact@sberdila.com",
            link: "mailto:contact@sberdila.com",
            color: "#9333EA"
        },
        {
            icon: <Phone size={24} />,
            title: "Téléphone",
            value: "+212 600 000 000",
            link: "tel:+212600000000",
            color: "#2ED573"
        },
        {
            icon: <MapPin size={24} />,
            title: "Adresse",
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
                        <span className="contact-badge">Contact</span>
                        <h1 className="contact-hero-title">
                            Parlons de votre <span className="text-gradient">Prochaine Paire</span>
                        </h1>
                        <p className="contact-hero-sub">
                            Une question sur une commande ou besoin d'un conseil style ?
                            Notre équipe est là pour vous aider à tout moment.
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
                                <h3 className="contact-social-label">Suivez-nous</h3>
                                <div className="contact-social-icons">
                                    {[{ icon: <Instagram />, label: "Instagram" }, { icon: <Twitter />, label: "Twitter" }, { icon: <Facebook />, label: "Facebook" }].map((item, i) => (
                                        <motion.button
                                            key={i}
                                            className="contact-social-btn"
                                            aria-label={`Suivez-nous sur ${item.label}`}
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
                                    <h2 className="contact-form-title">Envoyez un message</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="contact-form-row">
                                        <div className="contact-input-group">
                                            <label htmlFor="contact-name" className="contact-label">Nom complet</label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                placeholder="Votre nom"
                                                required
                                                className="contact-input"
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="contact-input-group">
                                            <label htmlFor="contact-email" className="contact-label">Email</label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                placeholder="votre@email.com"
                                                required
                                                className="contact-input"
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="contact-input-group">
                                        <label htmlFor="contact-subject" className="contact-label">Sujet</label>
                                        <input
                                            id="contact-subject"
                                            type="text"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            required
                                            className="contact-input"
                                            value={formState.subject}
                                            onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="contact-input-group">
                                        <label htmlFor="contact-message" className="contact-label">Message</label>
                                        <textarea
                                            id="contact-message"
                                            rows="5"
                                            placeholder="Votre message ici..."
                                            required
                                            className="contact-input"
                                            style={{ resize: 'none' }}
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitted}
                                        className="contact-submit-btn"
                                    >
                                        {isSubmitted ? (
                                            <>C'est envoyé !</>
                                        ) : (
                                            <><Send size={18} /> Envoyer le message</>
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
