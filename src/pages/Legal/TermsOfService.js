import React from 'react';
import SEO from '../../components/layout/SEO/SEO';
import './Legal.css';

const TermsOfService = () => (
    <div className="legal-page">
        <SEO title="Conditions Générales de Vente" />
        <div className="container">
            <div className="legal-wrapper">
                <header className="legal-header">
                    <h1 className="legal-title">Conditions Générales de Vente</h1>
                    <div className="legal-last-updated">Dernière mise à jour : 27 Janvier 2026</div>
                </header>
                <div className="legal-content">
                    <section>
                        <h2>1. Acceptation des conditions</h2>
                        <p>En utilisant le site Sberdila.com, vous acceptez d'être lié par les présentes conditions générales.</p>
                    </section>
                    <section>
                        <h2>2. Produits et Prix</h2>
                        <p>Tous nos produits sont garantis authentiques. Les prix sont affichés en Dirhams (DH) et incluent toutes les taxes applicables.</p>
                    </section>
                    <section>
                        <h2>3. Livraison</h2>
                        <p>Les délais de livraison sont de 24h à 48h. Le paiement s'effectue à la livraison ou par carte bancaire sécurisée.</p>
                    </section>
                </div>
            </div>
        </div>
    </div>
);

export default TermsOfService;
