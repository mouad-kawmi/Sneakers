import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { handleImageUpload } from '../utils/imageUtils';

const ImageInput = ({ label, value, onChange }) => (
    <div style={{ marginBottom: '16px' }}>
        <label className="admin-label">{label}</label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--bg-app)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border-subtle)'
            }}>
                {value ? (
                    <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                ) : (
                    <ImageIcon size={24} color="var(--text-gray)" />
                )}
            </div>
            <div style={{ flex: 1 }}>
                <input
                    type="text"
                    placeholder="Ou lien de l'image (ex: /images/products/shoe.png)"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="admin-input"
                    style={{ marginBottom: '8px' }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, onChange)}
                    className="admin-input"
                    style={{ padding: '8px' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>
                    Recommandé: PNG ou JPG de haute qualité. Utilisez des chemins relatifs pour la persistance.
                </p>
            </div>
        </div>
    </div>
);

export default ImageInput;
