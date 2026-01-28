import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../../store/slices/authSlice';

const PasswordChange = ({ setNotification }) => {
    const dispatch = useDispatch();
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const handlePasswordChange = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            setNotification({ type: 'error', message: 'Veuillez remplir tous les champs' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setNotification({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (passwordForm.new.length < 6) {
            setNotification({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        dispatch(updatePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.new }));
        setPasswordForm({ current: '', new: '', confirm: '' });
        setNotification({ type: 'success', message: 'Mot de passe modifié avec succès!' });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-clean)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '20px' }}>Changer le Mot de Passe</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Mot de passe actuel</label>
                    <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Nouveau mot de passe</label>
                    <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    />
                </div>
                <button
                    onClick={handlePasswordChange}
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
                    Mettre à jour le mot de passe
                </button>
            </div>
        </div>
    );
};

export default PasswordChange;
