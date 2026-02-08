import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProfileInfo from './ProfileInfo';
import PasswordChange from './PasswordChange';
import AddressManager from './AddressManager';

const ProfileSettings = ({ user }) => {
    const { t } = useTranslation();
    const [notification, setNotification] = useState(null);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="order-history-title">{t('profile.settings')}</h2>

            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="profile-setting-toast"
                    style={{
                        background: notification.type === 'success' ? '#2ed573' : '#ff4757',
                    }}
                >
                    {notification.message}
                </motion.div>
            )}

            <div className="profile-settings-grid">
                <ProfileInfo user={user} setNotification={setNotification} />
                <PasswordChange setNotification={setNotification} />
                <AddressManager user={user} setNotification={setNotification} />
            </div>
        </motion.div>
    );
};

export default ProfileSettings;
