import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { openLoginModal } from '../../store/slices/uiSlice';
import ProfileSidebar from './components/ProfileSidebar';
import OrderHistory from './components/OrderHistory';
import ProfileSettings from './components/ProfileSettings';

import './Profile.css';

const Profile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('orders');

    if (!isAuthenticated) {
        return (
            <div className="container profile-page-container">
                <div className="profile-auth-card">
                    <User size={64} className="profile-auth-icon" />
                    <h2 className="profile-auth-title">{t('auth.login_required')}</h2>
                    <p className="profile-auth-text">{t('auth.login_required_desc')}</p>
                    <button
                        onClick={() => dispatch(openLoginModal())}
                        className="btn-primary profile-auth-btn"
                    >
                        {t('auth.login')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container profile-page-container">
            <div className="profile-grid">
                <ProfileSidebar
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="profile-content-area">
                    {activeTab === 'orders' && <OrderHistory user={user} />}
                    {activeTab === 'settings' && <ProfileSettings user={user} />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
