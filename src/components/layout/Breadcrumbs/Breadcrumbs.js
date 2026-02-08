import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import './Breadcrumbs.css';

const Breadcrumbs = ({ customLinks = [] }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // If we're on the home page, don't show breadcrumbs
    if (pathnames.length === 0 && customLinks.length === 0) return null;

    return (
        <nav className="breadcrumbs container">
            <Link to={ROUTES.HOME} className="breadcrumb-item home">
                <Home size={16} />
                <span>{t('nav.home')}</span>
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1 && customLinks.length === 0;

                // Prettify common names
                let displayName = name;
                if (name === 'category') return null; // Skip 'category' segment
                if (name === 'product') return null; // Skip 'product' segment

                // Map known categories
                const categoryNames = {
                    'Men': t('nav.men'),
                    'Women': t('nav.women'),
                    'Kids': t('nav.kids'),
                    'contact': t('nav.contact'),
                    'search': t('nav.search'),
                    'profile': t('nav.user_profile'),
                    'checkout': t('nav.checkout')
                };
                displayName = categoryNames[name] || name;

                return (
                    <React.Fragment key={routeTo}>
                        <ChevronRight size={14} className="breadcrumb-separator" />
                        {isLast ? (
                            <span className="breadcrumb-item active">{displayName}</span>
                        ) : (
                            <Link to={routeTo} className="breadcrumb-item">
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}

            {customLinks.map((link, index) => (
                <React.Fragment key={link.path || index}>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    {index === customLinks.length - 1 ? (
                        <span className="breadcrumb-item active">{link.label}</span>
                    ) : (
                        <Link to={link.path} className="breadcrumb-item">
                            {link.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
