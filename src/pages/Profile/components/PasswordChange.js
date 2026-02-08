import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const PasswordChange = ({ setNotification }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const handlePasswordChange = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            setNotification({ type: 'error', message: t('profile.fill_all') });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setNotification({ type: 'error', message: t('profile.password_mismatch') });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (passwordForm.new.length < 6) {
            setNotification({ type: 'error', message: t('profile.password_min_length') });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        dispatch(updatePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.new }));
        setPasswordForm({ current: '', new: '', confirm: '' });
        setNotification({ type: 'success', message: t('profile.password_updated') });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="profile-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '20px' }}>{t('profile.password')}</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div className="profile-input-group">
                    <label className="profile-label">{t('profile.current_password')}</label>
                    <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div className="profile-input-group">
                    <label className="profile-label">{t('profile.new_password')}</label>
                    <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div className="profile-input-group">
                    <label className="profile-label">{t('profile.confirm_password')}</label>
                    <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <button
                    onClick={handlePasswordChange}
                    className="btn-animate"
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        width: 'fit-content'
                    }}
                >
                    {t('profile.update_password')}
                </button>
            </div>
        </div>
    );
};

export default PasswordChange;
