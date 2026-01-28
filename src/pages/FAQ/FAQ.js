import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import SEO from '../../components/layout/SEO/SEO';
import './FAQ.css';

const faqs = [
    {
        category: 'Commandes',
        questions: [
            { q: "Comment suivre ma commande ?", a: "Vous pouvez suivre votre commande dans la section 'Suivre ma commande' en utilisant votre numéro de commande reçu par email." },
            { q: "Puis-je modifier ma commande ?", a: "Une fois validée, une commande ne peut plus être modifiée. Contactez-nous rapidement si vous avez fait une erreur." },
            { q: "Quels sont les délais de livraison ?", a: "La livraison prend généralement 24h à 48h partout au Maroc." }
        ]
    },
    {
        category: 'Paiement',
        questions: [
            { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons le paiement à la livraison (Cash on Delivery), ainsi que les paiements par Carte Bancaire et PayPal via notre plateforme sécurisée." },
            { q: "Le paiement est-il sécurisé ?", a: "Oui, nous utilisons un cryptage SSL de bout en bout pour garantir la sécurité de vos informations bancaires." }
        ]
    },
    {
        category: 'Retours',
        questions: [
            { q: "Quelle est votre politique de retour ?", a: "Vous disposez de 7 jours après réception pour demander un échange ou un retour si le produit ne vous convient pas ou présente un défaut." },
            { q: "Les retours sont-ils gratuits ?", a: "Les retours sont gratuits en cas de défaut de fabrication. Pour les changements d'avis, les frais de retour sont à la charge du client." }
        ]
    }
];

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="faq-page">
            <SEO title="FAQ - Centre d'aide" />
            <div className="faq-hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="faq-hero-content">
                        <span className="faq-badge">Aide & Support</span>
                        <h1 className="faq-title">Comment pouvons-nous vous aider ?</h1>
                        <p className="faq-subtitle">Recherchez une réponse dans notre base de connaissances ou parcourez les catégories ci-dessous.</p>

                        <div className="faq-search-wrapper">
                            <Search className="faq-search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher une question..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="faq-search-input"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                <div className="faq-content-grid">
                    <div className="faq-questions-section">
                        {filteredFaqs.map((category, catIdx) => (
                            <div key={catIdx} className="faq-category-group">
                                <h2 className="faq-category-title">{category.category}</h2>
                                <div className="faq-accordion">
                                    {category.questions.map((faq, idx) => {
                                        const globalIdx = `${catIdx}-${idx}`;
                                        const isOpen = openIndex === globalIdx;

                                        return (
                                            <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                                                <button
                                                    className="faq-question-btn"
                                                    onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                                                >
                                                    <span>{faq.q}</span>
                                                    <ChevronDown className={`faq-chevron ${isOpen ? 'rotate' : ''}`} size={18} />
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="faq-answer-wrapper"
                                                        >
                                                            <div className="faq-answer-content">
                                                                <p>{faq.a}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="faq-sidebar">
                        <div className="faq-contact-card">
                            <div className="contact-card-icon"><MessageCircle size={32} /></div>
                            <h3>Besoin d'aide personnalisée ?</h3>
                            <p>Notre équipe est disponible 7j/7 pour répondre à toutes vos questions via WhatsApp ou Email.</p>
                            <button className="btn-primary w-full">Nous contacter</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
