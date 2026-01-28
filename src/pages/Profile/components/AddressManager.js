import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, X, MapPin, Phone, Home } from 'lucide-react';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../../store/slices/authSlice';

const AddressManager = ({ user, setNotification }) => {
    const dispatch = useDispatch();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });

    const handleAddressSubmit = () => {
        if (!addressForm.fullName || !addressForm.phone || !addressForm.address1 || !addressForm.city || !addressForm.postalCode) {
            setNotification({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        if (editingAddressId) {
            dispatch(updateAddress({ id: editingAddressId, ...addressForm }));
            setNotification({ type: 'success', message: 'Adresse modifiée avec succès!' });
        } else {
            dispatch(addAddress(addressForm));
            setNotification({ type: 'success', message: 'Adresse ajoutée avec succès!' });
        }
        setTimeout(() => setNotification(null), 3000);
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });
    };

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-clean)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Adresses de Livraison</h3>
                <button
                    onClick={() => {
                        setShowAddressForm(!showAddressForm);
                        setEditingAddressId(null);
                        setAddressForm({ fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '' });
                    }}
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
                    {showAddressForm ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Ajouter</>}
                </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ background: 'var(--bg-app)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Nom Complet</label>
                            <input
                                type="text"
                                value={addressForm.fullName}
                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Téléphone</label>
                            <input
                                type="tel"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Adresse</label>
                            <input
                                type="text"
                                value={addressForm.address1}
                                onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Complément d'adresse (optionnel)</label>
                            <input
                                type="text"
                                value={addressForm.address2}
                                onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Ville</label>
                            <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-gray)', marginBottom: '8px' }}>Code Postal</label>
                            <input
                                type="text"
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddressSubmit}
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
                        {editingAddressId ? 'Modifier l\'adresse' : 'Ajouter l\'adresse'}
                    </button>
                </motion.div>
            )}

            {/* Address List */}
            {user?.addresses && user.addresses.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                    {user.addresses.map(address => (
                        <div
                            key={address.id}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                border: address.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                                background: address.isDefault ? 'rgba(147, 51, 234, 0.05)' : 'var(--bg-card)',
                                position: 'relative'
                            }}
                        >
                            {address.isDefault && (
                                <span style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '700'
                                }}>
                                    PAR DÉFAUT
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
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                {!address.isDefault && (
                                    <button
                                        onClick={() => {
                                            dispatch(setDefaultAddress(address.id));
                                            setNotification({ type: 'success', message: 'Adresse par défaut mise à jour!' });
                                            setTimeout(() => setNotification(null), 3000);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            background: 'rgba(255, 107, 0, 0.1)',
                                            color: 'var(--primary)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Définir par défaut
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingAddressId(address.id);
                                        setAddressForm(address);
                                        setShowAddressForm(true);
                                    }}
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
                                    Modifier
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(deleteAddress(address.id));
                                        setNotification({ type: 'success', message: 'Adresse supprimée!' });
                                        setTimeout(() => setNotification(null), 3000);
                                    }}
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
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    <Home size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                    <p>Aucune adresse enregistrée</p>
                </div>
            )}
        </div>
    );
};

export default AddressManager;
