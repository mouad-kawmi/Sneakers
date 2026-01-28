import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import ProfileSidebar from './components/ProfileSidebar';
import OrderHistory from './components/OrderHistory';
import ProfileSettings from './components/ProfileSettings';

const Profile = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('orders');

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ marginTop: '120px', marginBottom: '100px', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-card)', padding: '60px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', maxWidth: '500px', margin: '0 auto' }}>
                    <User size={64} style={{ color: 'var(--text-gray)', marginBottom: '24px', opacity: 0.3 }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Connexion Requise</h2>
                    <p style={{ color: 'var(--text-gray)', marginBottom: '32px' }}>Veuillez vous connecter pour voir votre profil et vos commandes.</p>
                    <button
                        onClick={() => window.location.reload()} /* Simple way to trigger login modal via Navbar or just refresh */
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 'var(--radius-full)', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
                <ProfileSidebar
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div style={{ minHeight: '500px' }}>
                    {activeTab === 'orders' && <OrderHistory user={user} />}
                    {activeTab === 'settings' && <ProfileSettings user={user} />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
