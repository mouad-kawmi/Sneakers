import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    RotateCcw,
    Ruler,
    HelpCircle,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import './HelpCenter.css';

const HelpCenter = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'delivery';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

    const tabs = [
        { id: 'delivery', label: t('help_center.tab_delivery'), icon: Truck },
        { id: 'size-guide', label: t('help_center.tab_size_guide'), icon: Ruler },
        { id: 'faq-link', label: t('help_center.tab_faq'), icon: HelpCircle },
    ];

    const handleTabClick = (id) => {
        if (id === 'faq-link') {
            navigate('/faq');
            return;
        }
        setActiveTab(id);
    };

    return (
        <div className="container help-center-page">
            <header className="help-center-header">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="help-center-title">
                    {t('help_center.title')}<span className="text-gradient">{t('help_center.title_span')}</span>
                </motion.h1>
                <p className="help-center-subtitle">{t('help_center.subtitle')}</p>
            </header>

            <div className="help-center-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`help-center-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <main className="help-center-content">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {activeTab === 'delivery' && <DeliverySection t={t} />}
                        {activeTab === 'size-guide' && <SizeGuideSection t={t} />}
                        {activeTab === 'faq' && <FAQSection t={t} />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

const DeliverySection = ({ t }) => (
    <div className="help-center-section">
        <div className="help-center-grid">
            <div className="help-center-card">
                <div className="help-center-card-icon"><Truck size={24} color="var(--primary)" /></div>
                <h3 className="help-center-card-title">{t('help_center.delivery_title')}</h3>
                <p className="help-center-card-text">{t('help_center.delivery_desc')}</p>
                <ul className="help-center-list">
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.city_casa')}</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.city_others')}</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.shipping_fees')}</li>
                </ul>
            </div>
            <div className="help-center-card">
                <div className="help-center-card-icon"><RotateCcw size={24} color="var(--primary)" /></div>
                <h3 className="help-center-card-title">{t('help_center.returns_title')}</h3>
                <p className="help-center-card-text">{t('help_center.returns_desc')}</p>
                <ul className="help-center-list">
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.return_cond_1')}</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.return_cond_2')}</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> {t('help_center.return_cond_3')}</li>
                </ul>
            </div>
        </div>
        <div className="help-center-info-box" style={{ marginTop: '40px' }}>
            <h4 className="help-center-info-title"><ShieldCheck size={20} /> {t('help_center.verification_title')}</h4>
            <p className="help-center-info-text">{t('help_center.verification_desc')}</p>
        </div>
    </div>
);

const SizeGuideSection = ({ t }) => (
    <div className="help-center-section">
        <h3 className="help-center-title-sm">{t('help_center.size_table_title')}</h3>
        <div className="help-center-table-wrapper">
            <table className="help-center-table">
                <thead><tr><th className="help-center-th">{t('help_center.th_eu')}</th><th className="help-center-th">{t('help_center.th_us_m')}</th><th className="help-center-th">{t('help_center.th_us_w')}</th><th className="help-center-th">{t('help_center.th_uk')}</th><th className="help-center-th">{t('help_center.th_cm')}</th></tr></thead>
                <tbody>
                    {[
                        { eu: '40', usm: '7', usf: '8.5', uk: '6', cm: '25' },
                        { eu: '41', usm: '8', usf: '9.5', uk: '7', cm: '26' },
                        { eu: '42', usm: '8.5', usf: '10', uk: '7.5', cm: '26.5' },
                        { eu: '43', usm: '9.5', usf: '11', uk: '8.5', cm: '27.5' },
                        { eu: '44', usm: '10', usf: '11.5', uk: '9', cm: '28' },
                        { eu: '45', usm: '11', usf: '12.5', uk: '10', cm: '29' }
                    ].map((row, i) => (
                        <tr key={i} className="help-center-tr">
                            <td className="help-center-td">{row.eu}</td>
                            <td className="help-center-td">{row.usm}</td>
                            <td className="help-center-td">{row.usf}</td>
                            <td className="help-center-td">{row.uk}</td>
                            <td className="help-center-td">{row.cm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const FAQSection = ({ t }) => {
    const questions = [
        { q: t('help_center.faq_q1'), a: t('help_center.faq_a1') },
        { q: t('help_center.faq_q2'), a: t('help_center.faq_a2') },
        { q: t('help_center.faq_q3'), a: t('help_center.faq_a3') },
        { q: t('help_center.faq_q4'), a: t('help_center.faq_a4') }
    ];
    return (
        <div className="help-center-section">
            {questions.map((item, i) => (
                <div key={i} className="help-center-faq-card">
                    <h4 className="help-center-faq-question">{item.q}</h4>
                    <p className="help-center-faq-answer">{item.a}</p>
                </div>
            ))}
        </div>
    );
};

export default HelpCenter;
