import React, { useState, useEffect } from 'react';
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
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'delivery';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

    const tabs = [
        { id: 'delivery', label: 'Livraison & Retours', icon: Truck },
        { id: 'size-guide', label: 'Guide des Tailles', icon: Ruler },
        { id: 'faq-link', label: 'FAQ (Aide)', icon: HelpCircle },
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
                    Centre d'a<span className="text-gradient">ide</span>
                </motion.h1>
                <p className="help-center-subtitle">Tout ce que vous devez savoir pour une expérience SBERDILA exceptionnelle.</p>
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
                        {activeTab === 'delivery' && <DeliverySection />}
                        {activeTab === 'size-guide' && <SizeGuideSection />}
                        {activeTab === 'faq' && <FAQSection />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

const DeliverySection = () => (
    <div className="help-center-section">
        <div className="help-center-grid">
            <div className="help-center-card">
                <div className="help-center-card-icon"><Truck size={24} color="var(--primary)" /></div>
                <h3 className="help-center-card-title">Livraison Express</h3>
                <p className="help-center-card-text">Nous livrons partout au Maroc sous 24h à 48h. Toutes nos commandes sont suivies en temps réel.</p>
                <ul className="help-center-list">
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Casablanca : 24h</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Autres villes : 48h</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Frais de port : Gratuits dès 1000 DH</li>
                </ul>
            </div>
            <div className="help-center-card">
                <div className="help-center-card-icon"><RotateCcw size={24} color="var(--primary)" /></div>
                <h3 className="help-center-card-title">Retours Faciles</h3>
                <p className="help-center-card-text">Vous disposez de 7 jours après réception pour demander un échange ou un retour.</p>
                <ul className="help-center-list">
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Produit non porté uniquement</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Emballage d'origine requis</li>
                    <li className="help-center-list-item"><CheckCircle2 size={16} color="#2ED573" /> Échange gratuit</li>
                </ul>
            </div>
        </div>
        <div className="help-center-info-box" style={{ marginTop: '40px' }}>
            <h4 className="help-center-info-title"><ShieldCheck size={20} /> Processus de Vérification</h4>
            <p className="help-center-info-text">Chaque paire est inspectée manuellement par nos experts avant expédition.</p>
        </div>
    </div>
);

const SizeGuideSection = () => (
    <div className="help-center-section">
        <h3 className="help-center-title-sm">Tableau de Conversion</h3>
        <div className="help-center-table-wrapper">
            <table className="help-center-table">
                <thead><tr><th className="help-center-th">EU</th><th className="help-center-th">US Homme</th><th className="help-center-th">US Femme</th><th className="help-center-th">UK</th><th className="help-center-th">CM</th></tr></thead>
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

const FAQSection = () => {
    const questions = [
        { q: "Les sneakers sont-elles authentiques ?", a: "Oui, à 100%. Nous garantissons l'authenticité de chaque produit." },
        { q: "Quel est le délai de livraison ?", a: "Pour Casablanca, 24h. Pour les autres villes, 24h à 48h." },
        { q: "Quelles sont les méthodes de paiement ?", a: "Nous acceptons le Paiement à la Livraison partout au Maroc." },
        { q: "Puis-je changer la taille ?", a: "Oui, vous pouvez demander un échange sous 7 jours." }
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
