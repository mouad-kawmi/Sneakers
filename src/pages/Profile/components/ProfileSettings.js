import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileInfo from './ProfileInfo';
import PasswordChange from './PasswordChange';
import AddressManager from './AddressManager';

const ProfileSettings = ({ user }) => {
    const [notification, setNotification] = useState(null);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>Paramètres du Compte</h2>

            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: '100px',
                        right: '20px',
                        background: notification.type === 'success' ? '#2ed573' : '#ff4757',
                        color: 'white',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        fontWeight: '600'
                    }}
                >
                    {notification.message}
                </motion.div>
            )}

            <div style={{ display: 'grid', gap: '24px' }}>
                <ProfileInfo user={user} setNotification={setNotification} />
                <PasswordChange setNotification={setNotification} />
                <AddressManager user={user} setNotification={setNotification} />
            </div>
        </motion.div>
    );
};

export default ProfileSettings;
