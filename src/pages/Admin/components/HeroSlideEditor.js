import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { updateHeroSlide } from '../../../store/slices/contentSlice';
import ImageInput from './ImageInput';

const HeroSlideEditor = ({ slide }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [localSlide, setLocalSlide] = useState(slide);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (field, val) => {
        setLocalSlide(prev => ({ ...prev, [field]: val }));
        setHasChanges(true);
    };

    const handleSave = () => {
        dispatch(updateHeroSlide(localSlide));
        setHasChanges(false);
        alert(t('admin.saved_success'));
    };

    return (
        <div className="admin-card">
            <div className="hero-editor-container">
                <div className="hero-editor-grid">
                    <div>
                        <label className="admin-label">{t('admin.tagline')}</label>
                        <input
                            className="admin-input"
                            value={localSlide.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="admin-label">{t('product.description')}</label>
                        <textarea
                            className="admin-input"
                            style={{ minHeight: '80px', fontFamily: 'inherit' }}
                            value={localSlide.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <ImageInput
                        label={t('admin.hero_image')}
                        value={localSlide.image}
                        onChange={(val) => handleChange('image', val)}
                    />
                    {hasChanges && (
                        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            <Save size={20} /> {t('common.save')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSlideEditor;
