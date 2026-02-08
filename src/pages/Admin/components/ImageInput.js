import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { handleImageUpload } from '../utils/imageUtils';

const ImageInput = ({ label, value, onChange }) => {
    const { t } = useTranslation();
    return (
        <div className="admin-image-input-wrapper">
            <label className="admin-label">{label}</label>
            <div className="admin-image-input-container">
                <div className="admin-image-preview">
                    {value ? (
                        <img src={value} alt="Preview" />
                    ) : (
                        <ImageIcon size={24} color="var(--text-gray)" />
                    )}
                </div>
                <div className="admin-image-controls">
                    <input
                        type="text"
                        placeholder={t('admin.image_url_placeholder')}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="admin-input"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, onChange)}
                        className="admin-input"
                    />
                    <p className="admin-image-help">
                        {t('admin.image_help_text')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageInput;
