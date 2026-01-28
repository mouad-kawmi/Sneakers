import React from 'react';
import SEO from '../../components/layout/SEO/SEO';
import './Legal.css';

const PrivacyPolicy = () => (
    <div className="legal-page">
        <SEO title="Politique de Confidentialité" />
        <div className="container">
            <div className="legal-wrapper">
                <header className="legal-header">
                    <h1 className="legal-title">Politique de Confidentialité</h1>
                    <div className="legal-last-updated">Dernière mise à jour : 27 Janvier 2026</div>
                </header>
                <div className="legal-content">
                    <section>
                        <h2>1. Collecte des données</h2>
                        <p>Nous collectons les informations que vous nous fournissez lors de la création d'un compte, d'un achat ou de l'inscription à notre newsletter.</p>
                    </section>
                    <section>
                        <h2>2. Utilisation des données</h2>
                        <p>Vos données sont utilisées exclusivement pour traiter vos commandes, améliorer votre expérience sur Sberdila et vous envoyer des offres personnalisées si vous y avez consenti.</p>
                    </section>
                    <section>
                        <h2>3. Protection des données</h2>
                        <p>Nous mettons en œuvre des mesures de sécurité de pointe pour protéger vos informations personnelles contre tout accès non autorisé.</p>
                    </section>
                </div>
            </div>
        </div>
    </div>
);

export default PrivacyPolicy;
