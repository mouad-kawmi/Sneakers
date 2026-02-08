import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { updatePromoBanner } from '../../../store/slices/contentSlice';
import GradientPicker from './GradientPicker';
import { useToast } from '../../../context/ToastContext';

const PromoEditor = ({ initialData }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.products?.items || []);
    const [localData, setLocalData] = useState(initialData || {
        title: '',
        discount: 0,
        isActive: false,
        selectedProductIds: [],
        productsCount: 8 // Set default limit
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedProducts = allProducts.filter(p => localData.selectedProductIds?.includes(p.id));
    const filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, searchTerm ? 50 : 20); // Limit results for performance when not searching or showing first few

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
            // Check against current input limit or default 3 (Hard check for max 3 as requested)
            const limit = Math.min(localData.productsCount || 3, 3);
            if (newSelection.length < limit) {
                newSelection.push(id);
            } else {
                showToast(t('admin.products_limit_reached', { count: limit }), 'error');
                return;
            }
        }
        handleChange('selectedProductIds', newSelection);
    };

    const handleSave = () => {
        dispatch(updatePromoBanner(localData));
        setHasChanges(false);
        showToast(t('admin.promo_updated'), 'success');
    };

    return (
        <div className="admin-card">
            <div className="admin-promo-editor-grid">
                <div className={`admin-promo-status-card ${localData.isActive ? 'active' : ''}`}>
                    <div>
                        <h3 className="admin-promo-status-title">
                            {localData.isActive ? t('admin.promo_active') : t('admin.promo_inactive')}
                        </h3>
                        <p className="admin-promo-status-desc">
                            {localData.isActive ? t('admin.promo_visible_desc') : t('admin.promo_hidden_desc')}
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

                <div className="admin-promo-editor-content">
                    <div className="admin-promo-editor-form">
                        <div className="admin-grid-full">
                            <label className="admin-label">{t('admin.main_title')}</label>
                            <input
                                className="admin-input"
                                value={localData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="admin-label">{t('admin.discount_percentage')}</label>
                            <input
                                type="number"
                                className="admin-input"
                                value={localData.discount}
                                onChange={(e) => handleChange('discount', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="admin-label">{t('admin.max_products')}</label>
                            <input
                                type="number"
                                min="1"
                                max="3"
                                className="admin-input"
                                value={localData.productsCount || 3}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val <= 3) handleChange('productsCount', val);
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="admin-label">{t('admin.expiration_date')}</label>
                            <input
                                type="datetime-local"
                                className="admin-input"
                                value={localData.endTime ? new Date(localData.endTime).toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T') : ''}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handleChange('endTime', new Date(e.target.value).toISOString());
                                    }
                                }}
                            />
                        </div>

                        <div className="admin-grid-full">
                            <label className="admin-label">{t('admin.select_products')}</label>

                            <div className="admin-search-wrap" style={{ marginBottom: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                                    <input
                                        type="text"
                                        className="admin-input"
                                        placeholder={t('common.search')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    {searchTerm && (
                                        <X
                                            size={18}
                                            onClick={() => setSearchTerm('')}
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)', cursor: 'pointer' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {selectedProducts.length > 0 && (
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '11px', color: 'var(--text-gray)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {t('admin.selected_products')} ({selectedProducts.length}/{Math.min(localData.productsCount || 3, 3)})
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {selectedProducts.map(p => (
                                            <div
                                                key={`selected-${p.id}`}
                                                className="selected-product-tag"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    padding: '3px 8px 3px 3px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <img src={p.image} style={{ width: '22px', height: '22px', borderRadius: '5px', objectFit: 'cover' }} />
                                                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                                                <X size={12} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => toggleProductSelection(p.id)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="admin-promo-products-grid">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => toggleProductSelection(p.id)}
                                            style={{
                                                aspectRatio: '1',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: localData.selectedProductIds?.includes(p.id) ? '3px solid var(--primary)' : '1px solid var(--border-subtle)',
                                                position: 'relative',
                                                transition: 'all 0.2s'
                                            }}
                                            title={p.name}
                                        >
                                            <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {localData.selectedProductIds?.includes(p.id) && (
                                                <div style={{ position: 'absolute', top: 2, right: 2, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: 'var(--text-gray)' }}>
                                        {t('common.no_results')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="admin-promo-editor-sidebar">
                        <div>
                            <label className="admin-label">{t('admin.background_colors')}</label>
                            <GradientPicker
                                value={localData.gradient}
                                onChange={(val) => handleChange('gradient', val)}
                            />
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            {hasChanges && (
                                <button onClick={handleSave} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '16px' }}>
                                    <Save size={20} /> {t('common.save')}
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
