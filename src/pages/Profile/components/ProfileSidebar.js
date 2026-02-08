import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const ProfileSidebar = ({ user, activeTab, setActiveTab }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="profile-sidebar"
        >
            <div className="profile-avatar-container">
                <div className="profile-avatar-circle">
                    <User size={40} />
                </div>
                <h2 className="profile-user-name">{user.name}</h2>
                <p className="profile-user-email">{user.email}</p>
            </div>

            <div className="profile-nav-list">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                >
                    <Package size={20} /> <span>{t('profile.orders')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                >
                    <Settings size={20} /> <span>{t('profile.settings')}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="profile-nav-btn logout"
                >
                    <LogOut size={20} /> <span>{t('auth.logout')}</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileSidebar;
