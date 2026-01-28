import React from 'react';
import { Home, RefreshCcw } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-page">
                    <div className="container">
                        <div className="error-boundary-content">
                            <div className="error-boundary-icon-box">
                                <div className="error-boundary-pulse"></div>
                                <RefreshCcw size={48} className="error-boundary-icon" />
                            </div>
                            <h1 className="error-boundary-title">Quelque chose s'est mal <span className="text-gradient">passé</span></h1>
                            <p className="error-boundary-text">
                                Une erreur inattendue est survenue. Ne vous inquiétez pas, vos sneakers sont en sécurité !
                                Essayez de rafraîchir la page ou de revenir à l'accueil.
                            </p>
                            <div className="error-boundary-actions">
                                <button onClick={() => window.location.reload()} className="error-boundary-btn primary">
                                    <RefreshCcw size={18} /> Actualiser la page
                                </button>
                                <button onClick={() => window.location.href = '/'} className="error-boundary-btn secondary">
                                    <Home size={18} /> Retour à l'accueil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
