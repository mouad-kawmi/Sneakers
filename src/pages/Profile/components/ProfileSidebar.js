import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';

const ProfileSidebar = ({ user, activeTab, setActiveTab }) => {
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
            style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', height: 'fit-content', boxShadow: 'var(--shadow-clean)', border: '1px solid var(--border-subtle)' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00 0%, #FF8F40 100%)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={40} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-main)' }}>{user.name}</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', margin: 0 }}>{user.email}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        background: activeTab === 'orders' ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                        color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-gray)',
                        border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left'
                    }}
                >
                    <Package size={20} /> Mes Commandes
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        background: activeTab === 'settings' ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                        color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-gray)',
                        border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left'
                    }}
                >
                    <Settings size={20} /> Paramètres
                </button>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        background: 'transparent', color: '#ff4757',
                        border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left', marginTop: '20px'
                    }}
                >
                    <LogOut size={20} /> Se déconnecter
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileSidebar;
