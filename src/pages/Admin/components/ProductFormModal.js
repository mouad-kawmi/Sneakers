import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus } from 'lucide-react';
import { addProduct, updateProduct } from '../../../store/slices/productSlice';
import MultiImageInput from './MultiImageInput';

const ProductFormModal = ({ isOpen, onClose, editingProduct }) => {
    const dispatch = useDispatch();
    const content = useSelector((state) => state.content || {});

    const [productFormData, setProductFormData] = useState({
        name: '', brand: '', category: 'Men', price: '', discount: 0, isNew: false, sizes: [], images: []
    });
    const [newSizeInput, setNewSizeInput] = useState({ size: '', stock: '' });

    useEffect(() => {
        if (editingProduct) {
            setProductFormData({
                ...editingProduct,
                sizes: editingProduct.sizes || [],
                images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : [])
            });
        } else {
            setProductFormData({
                name: '',
                brand: content.brands?.[0]?.name || '',
                category: 'Men',
                price: '',
                images: [],
                discount: 0,
                isNew: true,
                sizes: []
            });
        }
    }, [editingProduct, isOpen, content.brands]);

    if (!isOpen) return null;

    const handleProductSubmit = (e) => {
        e.preventDefault();

        if (!productFormData.brand) {
            alert("Veuillez sélectionner une marque !");
            return;
        }

        const priceNum = Number(String(productFormData.price).replace(',', '.'));
        if (isNaN(priceNum) || priceNum <= 0) {
            alert("Le prix doit être un nombre valide !");
            return;
        }

        let finalSizes = [...productFormData.sizes];
        if (newSizeInput.size && newSizeInput.stock) {
            const s = Number(newSizeInput.size);
            const st = Number(newSizeInput.stock);

            // Size Validation
            if (s < 35 || s > 48) {
                alert("La taille doit être entre 35 et 48 !");
                return;
            }

            if (!finalSizes.some(sz => sz.size === s)) {
                finalSizes.push({ size: s, stock: st });
                finalSizes.sort((a, b) => a.size - b.size);
            }
        }

        const discountStr = String(productFormData.discount).replace(',', '.');
        const finalImages = productFormData.images || [];
        const mainImage = finalImages.length > 0 ? finalImages[0] : '';

        const payload = {
            ...productFormData,
            id: editingProduct ? editingProduct.id : Date.now(),
            price: priceNum,
            discount: Number(discountStr) || 0,
            image: mainImage,
            images: finalImages,
            sizes: finalSizes,
            isNew: Boolean(productFormData.isNew)
        };

        if (editingProduct) {
            dispatch(updateProduct(payload));
            alert("Produit mis à jour avec succès !");
        } else {
            dispatch(addProduct(payload));
            alert("Produit ajouté avec succès !");
        }
        setNewSizeInput({ size: '', stock: '' });
        onClose();
    };

    const handleAddSize = () => {
        if (!newSizeInput.size || !newSizeInput.stock) return;
        const sizeNum = Number(newSizeInput.size);
        const stockNum = Number(newSizeInput.stock);

        // Size Validation
        if (sizeNum < 35 || sizeNum > 48) {
            alert("La taille doit être entre 35 et 48 !");
            return;
        }

        if (productFormData.sizes.some(s => s.size === sizeNum)) {
            alert("Cette taille existe déjà.");
            return;
        }

        const newSizes = [...productFormData.sizes, { size: sizeNum, stock: stockNum }]
            .sort((a, b) => a.size - b.size);

        setProductFormData({ ...productFormData, sizes: newSizes });
        setNewSizeInput({ size: '', stock: '' });
    };

    const handleRemoveSize = (sizeToRemove) => {
        setProductFormData({
            ...productFormData,
            sizes: productFormData.sizes.filter(s => s.size !== sizeToRemove)
        });
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-backdrop" onClick={onClose} />
            <div className="admin-modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2>{editingProduct ? 'Modifier' : 'Nouveau'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X size={24} /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="admin-form">
                    <div style={{ gridColumn: 'span 2' }}>
                        <label className="admin-label">Nom</label>
                        <input className="admin-input" value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="admin-label">Marque</label>
                        {(content.brands && content.brands.length > 0) ? (
                            <select
                                className="admin-input"
                                value={productFormData.brand}
                                onChange={e => setProductFormData({ ...productFormData, brand: e.target.value })}
                                required
                            >
                                <option value="">-- Sélectionner --</option>
                                {content.brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                            </select>
                        ) : (
                            <input
                                className="admin-input"
                                placeholder="Nom de la marque (ex: Nike)"
                                value={productFormData.brand}
                                onChange={e => setProductFormData({ ...productFormData, brand: e.target.value })}
                                required
                            />
                        )}
                    </div>
                    <div>
                        <label className="admin-label">Prix</label>
                        <input type="number" className="admin-input" value={productFormData.price} onChange={e => setProductFormData({ ...productFormData, price: e.target.value })} required />
                    </div>
                    <div>
                        <label className="admin-label">Catégorie</label>
                        <select
                            className="admin-input"
                            value={productFormData.category}
                            onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
                            required
                        >
                            <option value="Men">Hommes (Men)</option>
                            <option value="Women">Femmes (Women)</option>
                            <option value="Kids">Enfants (Kids)</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <MultiImageInput
                            images={productFormData.images}
                            onChange={newImages => setProductFormData({ ...productFormData, images: newImages })}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h4 className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Tailles & Stock (35-48)
                            <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: '0.6' }}>{productFormData.sizes.length} Tailles ajoutées</span>
                        </h4>

                        <div className="admin-add-size-row">
                            <div className="admin-size-input-group">
                                <input
                                    type="number"
                                    placeholder="Taille (35-48)"
                                    min="35"
                                    max="48"
                                    className="admin-input"
                                    value={newSizeInput.size}
                                    onChange={e => setNewSizeInput({ ...newSizeInput, size: e.target.value })}
                                />
                            </div>
                            <div className="admin-size-input-group">
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    className="admin-input"
                                    value={newSizeInput.stock}
                                    onChange={e => setNewSizeInput({ ...newSizeInput, stock: e.target.value })}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSize}
                                className="admin-add-size-btn"
                                disabled={!newSizeInput.size || !newSizeInput.stock}
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="sizes-grid">
                            {productFormData.sizes.map((s, i) => (
                                <div key={i} className="admin-size-stock-item pro-size-card">
                                    <div className="admin-size-card-header">
                                        <span className="admin-size-label">T{s.size}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSize(s.size)}
                                            className="admin-remove-size-btn"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        className="admin-size-stock-input"
                                        value={s.stock}
                                        onChange={e => {
                                            const ns = [...productFormData.sizes];
                                            ns[i] = { ...ns[i], stock: parseInt(e.target.value) || 0 };
                                            setProductFormData({ ...productFormData, sizes: ns });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Enregistrer</button>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
