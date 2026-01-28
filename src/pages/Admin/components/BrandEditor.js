import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Save } from 'lucide-react';
import { updateBrand } from '../../../store/slices/contentSlice';
import GradientPicker from './GradientPicker';
import ImageInput from './ImageInput';

const BrandEditor = ({ brand }) => {
    const dispatch = useDispatch();
    const [localBrand, setLocalBrand] = useState(brand);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (field, val) => {
        setLocalBrand(prev => ({ ...prev, [field]: val }));
        setHasChanges(true);
    };

    const handleSave = () => {
        dispatch(updateBrand({
            originalName: brand.name,
            data: localBrand
        }));
        setHasChanges(false);
        alert('Marque mise à jour !');
    };

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: localBrand.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {localBrand.name[0]}
                </div>
                <h3 style={{ margin: 0 }}>{localBrand.name}</h3>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                    <label className="admin-label">Nom</label>
                    <input
                        className="admin-input"
                        value={localBrand.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="admin-label">Nombre de produits</label>
                    <input
                        className="admin-input"
                        value={localBrand.count}
                        onChange={(e) => handleChange('count', e.target.value)}
                    />
                </div>
                <div>
                    <label className="admin-label">Gradient CSS</label>
                    <GradientPicker
                        value={localBrand.gradient}
                        onChange={(val) => handleChange('gradient', val)}
                    />
                </div>
                <ImageInput
                    label="Logo de la Marque (Transparent)"
                    value={localBrand.logo}
                    onChange={(val) => handleChange('logo', val)}
                />
                {hasChanges && (
                    <button onClick={handleSave} className="btn-primary" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <Save size={20} /> Enregistrer
                    </button>
                )}
            </div>
        </div>
    );
};

export default BrandEditor;
