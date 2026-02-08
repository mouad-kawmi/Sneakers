import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Edit2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { updateUserProfile } from '../../../store/slices/authSlice';

const ProfileInfo = ({ user, setNotification }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });

    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{t('profile.personal_info')}</h3>
                <button
                    onClick={() => {
                        if (editingProfile) {
                            dispatch(updateUserProfile(profileForm));
                            setNotification({ type: 'success', message: t('profile.update_success') });
                            setTimeout(() => setNotification(null), 3000);
                        }
                        setEditingProfile(!editingProfile);
                    }}
                    className="btn-animate"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: editingProfile ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.1)',
                        color: editingProfile ? 'white' : 'var(--primary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    {editingProfile ? <><Save size={16} /> {t('profile.save')}</> : <><Edit2 size={16} /> {t('profile.edit')}</>}
                </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div className="profile-input-group">
                    <label className="profile-label">{t('profile.full_name')}</label>
                    <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        disabled={!editingProfile}
                        className="profile-input"
                    />
                </div>
                <div className="profile-input-group">
                    <label className="profile-label">{t('profile.email')}</label>
                    <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        disabled={!editingProfile}
                        className="profile-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
