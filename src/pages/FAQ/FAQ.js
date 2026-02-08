import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import SEO from '../../components/layout/SEO/SEO';
import './FAQ.css';

const FAQ = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: t('faq_page.cat_orders'),
            questions: [
                { q: t('faq_page.q_track'), a: t('faq_page.a_track') },
                { q: t('faq_page.q_modify'), a: t('faq_page.a_modify') },
                { q: t('faq_page.q_delivery'), a: t('faq_page.a_delivery') }
            ]
        },
        {
            category: t('faq_page.cat_payment'),
            questions: [
                { q: t('faq_page.q_methods'), a: t('faq_page.a_methods') },
                { q: t('faq_page.q_secure'), a: t('faq_page.a_secure') }
            ]
        },
        {
            category: t('faq_page.cat_returns'),
            questions: [
                { q: t('faq_page.q_policy'), a: t('faq_page.a_policy') },
                { q: t('faq_page.q_free_returns'), a: t('faq_page.a_free_returns') }
            ]
        }
    ];

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="faq-page">
            <SEO title={t('faq_page.seo_title')} />
            <div className="faq-hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="faq-hero-content">
                        <span className="faq-badge">{t('faq_page.badge')}</span>
                        <h1 className="faq-title">{t('faq_page.title')}</h1>
                        <p className="faq-subtitle">{t('faq_page.subtitle')}</p>

                        <div className="faq-search-wrapper">
                            <Search className="faq-search-icon" size={20} />
                            <input
                                type="text"
                                placeholder={t('faq_page.search_placeholder')}
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
                            <h3>{t('faq_page.sidebar_title')}</h3>
                            <p>{t('faq_page.sidebar_desc')}</p>
                            <button className="btn-primary w-full">{t('faq_page.contact_btn')}</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
