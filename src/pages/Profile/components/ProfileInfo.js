import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Edit2, Save } from 'lucide-react';
import { updateUserProfile } from '../../../store/slices/authSlice';

const ProfileInfo = ({ user, setNotification }) => {
    const dispatch = useDispatch();
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-clean)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Informations Personnelles</h3>
                <button
                    onClick={() => {
                        if (editingProfile) {
                            dispatch(updateUserProfile(profileForm));
                            setNotification({ type: 'success', message: 'Profil mis à jour avec succès!' });
                            setTimeout(() => setNotification(null), 3000);
                        }
                        setEditingProfile(!editingProfile);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: editingProfile ? 'var(--primary)' : 'rgba(255, 107, 0, 0.1)',
                        color: editingProfile ? 'white' : 'var(--primary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    {editingProfile ? <><Save size={16} /> Sauvegarder</> : <><Edit2 size={16} /> Modifier</>}
                </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Nom Complet</label>
                    <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        disabled={!editingProfile}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '14px',
                            background: editingProfile ? 'var(--bg-card)' : 'var(--bg-app)',
                            color: 'var(--text-main)',
                            cursor: editingProfile ? 'text' : 'not-allowed'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Email</label>
                    <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        disabled={!editingProfile}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '14px',
                            background: editingProfile ? 'var(--bg-card)' : 'var(--bg-app)',
                            color: 'var(--text-main)',
                            cursor: editingProfile ? 'text' : 'not-allowed'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
