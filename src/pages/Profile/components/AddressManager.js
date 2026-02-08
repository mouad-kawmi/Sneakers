import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, X, MapPin, Phone, Home } from 'lucide-react';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const AddressManager = ({ user, setNotification }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });

    const handleAddressSubmit = () => {
        if (!addressForm.fullName || !addressForm.phone || !addressForm.address1 || !addressForm.city || !addressForm.postalCode) {
            setNotification({ type: 'error', message: t('profile.fill_required') });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (editingAddressId) {
            dispatch(updateAddress({ id: editingAddressId, ...addressForm }));
            setNotification({ type: 'success', message: t('profile.address_updated') });
        } else {
            dispatch(addAddress(addressForm));
            setNotification({ type: 'success', message: t('profile.address_added') });
        }
        setTimeout(() => setNotification(null), 3000);
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });
    };

    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{t('profile.addresses')}</h3>
                <button
                    onClick={() => {
                        setShowAddressForm(!showAddressForm);
                        setEditingAddressId(null);
                        setAddressForm({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });
                    }}
                    className="btn-animate"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: showAddressForm ? '#ff4757' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    {showAddressForm ? <><X size={16} /> {t('common.cancel')}</> : <><Plus size={16} /> {t('common.add')}</>}
                </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ background: 'var(--bg-app)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}
                >
                    <div className="profile-address-form-grid">
                        <div className="profile-input-group">
                            <label className="profile-label">{t('profile.full_name')}</label>
                            <input
                                type="text"
                                value={addressForm.fullName}
                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-input-group">
                            <label className="profile-label">{t('profile.phone')}</label>
                            <input
                                type="tel"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-input-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="profile-label">{t('profile.address')}</label>
                            <input
                                type="text"
                                value={addressForm.address1}
                                onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-input-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="profile-label">{t('profile.address_complement')}</label>
                            <input
                                type="text"
                                value={addressForm.address2}
                                onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-input-group">
                            <label className="profile-label">{t('profile.city')}</label>
                            <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                        <div className="profile-input-group">
                            <label className="profile-label">{t('profile.postal_code')}</label>
                            <input
                                type="text"
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                className="profile-input"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddressSubmit}
                        className="btn-animate"
                        style={{
                            marginTop: '16px',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        {editingAddressId ? t('profile.update_address') : t('profile.add_address')}
                    </button>
                </motion.div>
            )}

            {/* Address List */}
            {user?.addresses && user.addresses.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                    {user.addresses.map(address => (
                        <div
                            key={address.id}
                            className={`profile-address-card ${address.isDefault ? 'default' : ''}`}
                        >
                            {address.isDefault && (
                                <span className="profile-address-badge">
                                    {t('profile.default')}
                                </span>
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '700', color: 'var(--text-main)', margin: '0 0 4px' }}>{address.fullName}</p>
                                    <p style={{ fontSize: '14px', color: 'var(--text-gray)', margin: '0 0 2px' }}>{address.address1}</p>
                                    {address.address2 && <p style={{ fontSize: '14px', color: 'var(--text-gray)', margin: '0 0 2px' }}>{address.address2}</p>}
                                    <p style={{ fontSize: '14px', color: 'var(--text-gray)', margin: '0 0 8px' }}>{address.city}, {address.postalCode}</p>
                                    <p style={{ fontSize: '14px', color: 'var(--text-gray)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={14} /> {address.phone}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {!address.isDefault && (
                                    <button
                                        onClick={() => {
                                            dispatch(setDefaultAddress(address.id));
                                            setNotification({ type: 'success', message: t('profile.address_default_updated') });
                                            setTimeout(() => setNotification(null), 3000);
                                        }}
                                        className="btn-animate"
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            background: 'rgba(var(--primary-rgb), 0.1)',
                                            color: 'var(--primary)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {t('profile.set_default')}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingAddressId(address.id);
                                        setAddressForm(address);
                                        setShowAddressForm(true);
                                    }}
                                    className="btn-animate"
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        background: 'rgba(55, 66, 250, 0.1)',
                                        color: '#3742fa',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {t('common.modify')}
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(deleteAddress(address.id));
                                        setNotification({ type: 'success', message: t('profile.address_deleted') });
                                        setTimeout(() => setNotification(null), 3000);
                                    }}
                                    className="btn-animate"
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        background: 'rgba(255, 71, 87, 0.1)',
                                        color: '#ff4757',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    <Home size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                    <p>{t('profile.no_addresses')}</p>
                </div>
            )}
        </div>
    );
};

export default AddressManager;
