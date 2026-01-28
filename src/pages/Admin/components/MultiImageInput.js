import React from 'react';
import { Image as ImageIcon, X, Plus, Upload } from 'lucide-react';
import { handleImageUpload } from '../utils/imageUtils';

const MultiImageInput = ({ images = [], onChange }) => {

    const handleAddImage = (newImage) => {
        onChange([...images, newImage]);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const handleFileUpload = (e) => {
        
        handleImageUpload(e, (compressedInfo) => {
            handleAddImage(compressedInfo);
        });
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Images du Produit ({images.length})</label>
            <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                La première image sera l'image principale. Ajoutez jusqu'à 4 images.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {/* Existing Images */}
                {images.map((img, index) => (
                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-app)'
                        }}>
                            <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#ea5455',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            <X size={12} />
                        </button>
                        {index === 0 && (
                            <span style={{
                                position: 'absolute',
                                bottom: '4px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '9px',
                                pointerEvents: 'none'
                            }}>
                                Main
                            </span>
                        )}
                    </div>
                ))}

                {/* Add New Button */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                    />
                    <Plus size={24} color="var(--text-gray)" />
                    <span style={{ fontSize: '10px', color: 'var(--text-gray)', marginTop: '4px' }}>Ajouter</span>
                </div>
            </div>

            {/* Optional: URL Input for quick add of external images */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    placeholder="Ou coller une URL d'image ici..."
                    className="admin-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (e.target.value) {
                                handleAddImage(e.target.value);
                                e.target.value = '';
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MultiImageInput;
