import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateBrand, deleteBrand } from '../../../store/slices/contentSlice';
import { Save, Trash2 } from 'lucide-react';
import GradientPicker from './GradientPicker';
import ImageInput from './ImageInput';
import { useToast } from '../../../context/ToastContext';

const BrandEditor = ({ brand }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [localBrand, setLocalBrand] = useState(brand);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setLocalBrand(brand);
    }, [brand]);

    const handleChange = (field, val) => {
        setLocalBrand(prev => ({ ...prev, [field]: val }));
        setHasChanges(true);
    };

    const handleSave = () => {
        if (localBrand.name) {
            dispatch(updateBrand({
                originalName: brand.name,
                data: localBrand
            }));
            setHasChanges(false);
            showToast(t('admin.brand_updated'), 'success');
        }
    };

    const handleDelete = () => {
        if (window.confirm(t('admin.confirm_delete_brand'))) {
            dispatch(deleteBrand(brand.name));
            showToast(t('admin.brand_deleted'), 'success');
        }
    };

    return (
        <div className="admin-card">
            <div className="admin-brand-header">
                <div className="admin-brand-info">
                    <div className="admin-brand-avatar" style={{ background: localBrand.gradient }}>
                        {localBrand.name[0]}
                    </div>
                    <h3 className="admin-brand-name">{localBrand.name}</h3>
                </div>
                <button onClick={handleDelete} className="btn-icon-danger" title={t('common.delete')}>
                    <Trash2 size={20} />
                </button>
            </div>
            <div className="admin-brand-form">
                <div>
                    <label className="admin-label">{t('admin.name')}</label>
                    <input
                        className="admin-input"
                        value={localBrand.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="admin-label">{t('admin.products_count')}</label>
                    <input
                        className="admin-input"
                        value={localBrand.count}
                        onChange={(e) => handleChange('count', e.target.value)}
                    />
                </div>
                <div className="admin-grid-full">
                    <label className="admin-label">{t('admin.gradient_css')}</label>
                    <GradientPicker
                        value={localBrand.gradient}
                        onChange={(val) => handleChange('gradient', val)}
                    />
                </div>
                <div className="admin-grid-full">
                    <ImageInput
                        label={t('admin.brand_logo')}
                        value={localBrand.logo}
                        onChange={(val) => handleChange('logo', val)}
                    />
                </div>
                {hasChanges && (
                    <button onClick={handleSave} className="btn-primary admin-grid-full" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <Save size={20} /> {t('common.save')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BrandEditor;
