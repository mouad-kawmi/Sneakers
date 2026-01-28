import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart, Zap } from 'lucide-react';
import SEO from '../../components/layout/SEO/SEO';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-page">
            <SEO title="À Propos de Sberdila" description="Découvrez l'histoire de Sberdila, votre destination premium pour sneakers au Maroc." />

            <section className="about-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="about-hero-card"
                    >
                        <h1 className="about-hero-title">Plus qu'une boutique, <span className="text-gradient">un style de vie.</span></h1>
                        <p className="about-hero-text">
                            Sberdila est née de la passion pour la culture sneaker et le désir d'offrir au Maroc une destination shopping de classe mondiale.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="about-vision">
                <div className="container">
                    <div className="vision-grid">
                        <div className="vision-text">
                            <span className="section-label">Notre Vision</span>
                            <h2 className="vision-title">Redéfinir le marché de la sneaker au Maroc.</h2>
                            <p>Nous croyons que chaque paire de chaussures raconte une histoire. Notre mission est de vous aider à écrire la vôtre en vous fournissant les pièces les plus exclusives et les plus convoitées du marché.</p>
                            <p>L'authenticité n'est pas une option, c'est notre fondation. Chaque produit est rigoureusement vérifié pour garantir une satisfaction totale.</p>
                        </div>
                        <div className="vision-image-box">
                            <div className="vision-stat-card">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Authentique</span>
                            </div>
                            <div className="vision-image-shimmer" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values">
                <div className="container">
                    <h2 className="values-main-title">Nos Valeurs</h2>
                    <div className="values-grid">
                        {[
                            { icon: ShieldCheck, title: "Authenticité", desc: "Zéro contrefaçon. Nous ne vendons que du vrai, vérifié par des experts." },
                            { icon: Award, title: "Excellence", desc: "Du packaging à la livraison, nous visons l'exceptionnel." },
                            { icon: Heart, title: "Passion", desc: "Pour nous, les sneakers sont un art, pas juste un commerce." },
                            { icon: Zap, title: "Rapidité", desc: "Livraison en 24h à 48h partout dans le royaume." }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="value-card"
                            >
                                <div className="value-icon"><value.icon size={24} /></div>
                                <h3 className="value-title">{value.title}</h3>
                                <p className="value-text">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
