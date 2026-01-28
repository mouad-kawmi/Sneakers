import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save } from 'lucide-react';
import { updatePromoBanner } from '../../../store/slices/contentSlice';
import GradientPicker from './GradientPicker';

const PromoEditor = ({ initialData }) => {
    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.products?.items || []);
    const [localData, setLocalData] = useState(initialData || {
        title: '',
        discount: 0,
        isActive: false,
        selectedProductIds: []
    });

    const [hasChanges, setHasChanges] = useState(false);

    if (!localData) return null;

    const handleChange = (field, val) => {
        setLocalData(prev => ({ ...prev, [field]: val }));
        setHasChanges(true);
    };

    const toggleProductSelection = (id) => {
        let newSelection = [...(localData.selectedProductIds || [])];
        if (newSelection.includes(id)) {
            newSelection = newSelection.filter(sid => sid !== id);
        } else {
            if (newSelection.length < (localData.productsCount || 8)) {
                newSelection.push(id);
            } else {
                alert(`Vous avez atteint la limite de ${localData.productsCount} produits.`);
                return;
            }
        }
        handleChange('selectedProductIds', newSelection);
    };

    const handleSave = () => {
        dispatch(updatePromoBanner(localData));
        setHasChanges(false);
        alert('Promo mise à jour !');
    };

    return (
        <div className="admin-card">
            <div style={{ display: 'grid', gap: '24px' }}>
                <div className={`admin-promo-status-card ${localData.isActive ? 'active' : ''}`}>
                    <div>
                        <h3 className="admin-promo-status-title">
                            {localData.isActive ? 'Promotion Active' : 'Promotion Désactivée'}
                        </h3>
                        <p className="admin-promo-status-desc">
                            {localData.isActive ? 'Le bandeau est visible sur la page d\'accueil.' : 'Le bandeau est masqué pour les clients.'}
                        </p>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                        <input
                            type="checkbox"
                            checked={localData.isActive}
                            onChange={(e) => handleChange('isActive', e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: localData.isActive ? 'var(--primary)' : 'var(--text-gray)',
                            transition: '.4s', borderRadius: '34px'
                        }}>
                            <span style={{
                                position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                                backgroundColor: 'var(--bg-card)', transition: '.4s', borderRadius: '50%',
                                transform: localData.isActive ? 'translateX(26px)' : 'translateX(0)'
                            }}></span>
                        </span>
                    </label>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', flex: '1 1 500px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-label">Titre Principal</label>
                            <input
                                className="admin-input"
                                value={localData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="admin-label">Remise (%)</label>
                            <input
                                type="number"
                                className="admin-input"
                                value={localData.discount}
                                onChange={(e) => handleChange('discount', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="admin-label">Nombre de produits Max</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                className="admin-input"
                                value={localData.productsCount || 3}
                                onChange={(e) => handleChange('productsCount', Number(e.target.value))}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-label">Date d'expiration de l'offre</label>
                            <input
                                type="datetime-local"
                                className="admin-input"
                                value={localData.endTime ? new Date(localData.endTime).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleChange('endTime', new Date(e.target.value).toISOString())}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-label">Sélectionner les produits à afficher</label>
                            <div className="admin-promo-products-grid">
                                {allProducts.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => toggleProductSelection(p.id)}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: localData.selectedProductIds?.includes(p.id) ? '3px solid var(--primary)' : '1px solid var(--border-subtle)',
                                            position: 'relative'
                                        }}
                                        title={p.name}
                                    >
                                        <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {localData.selectedProductIds?.includes(p.id) && (
                                            <div style={{ position: 'absolute', top: 2, right: 2, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '0 1 350px', minWidth: '300px' }}>
                        <div>
                            <label className="admin-label">Couleurs de fond</label>
                            <GradientPicker
                                value={localData.gradient}
                                onChange={(val) => handleChange('gradient', val)}
                            />
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            {hasChanges && (
                                <button onClick={handleSave} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '16px' }}>
                                    <Save size={20} /> Enregistrer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoEditor;
