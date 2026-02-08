import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart, Zap } from 'lucide-react';
import SEO from '../../components/layout/SEO/SEO';
import './AboutUs.css';

const AboutUs = () => {
    const { t } = useTranslation();
    return (
        <div className="about-page">
            <SEO title={t('about_us.seo_title')} description={t('about_us.seo_desc')} />

            <section className="about-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="about-hero-card"
                    >
                        <h1 className="about-hero-title">{t('about_us.hero_title')}<span className="text-gradient">{t('about_us.hero_title_span')}</span></h1>
                        <p className="about-hero-text">
                            {t('about_us.hero_text')}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="about-vision">
                <div className="container">
                    <div className="vision-grid">
                        <div className="vision-text">
                            <span className="section-label">{t('about_us.vision_label')}</span>
                            <h2 className="vision-title">{t('about_us.vision_title')}</h2>
                            <p>{t('about_us.vision_desc_1')}</p>
                            <p>{t('about_us.vision_desc_2')}</p>
                        </div>
                        <div className="vision-image-box">
                            <div className="vision-stat-card">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">{t('about_us.stat_label')}</span>
                            </div>
                            <div className="vision-image-shimmer" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values">
                <div className="container">
                    <h2 className="values-main-title">{t('about_us.values_title')}</h2>
                    <div className="values-grid">
                        {[
                            { icon: ShieldCheck, title: t('about_us.value_auth_title'), desc: t('about_us.value_auth_desc') },
                            { icon: Award, title: t('about_us.value_exc_title'), desc: t('about_us.value_exc_desc') },
                            { icon: Heart, title: t('about_us.value_pass_title'), desc: t('about_us.value_pass_desc') },
                            { icon: Zap, title: t('about_us.value_speed_title'), desc: t('about_us.value_speed_desc') }
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
