import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { X, Plus } from 'lucide-react';
import { addProduct, updateProduct } from '../../../store/slices/productSlice';
import MultiImageInput from './MultiImageInput';
import MobileSheetSelect from '../../../components/common/MobileSelect/MobileSheetSelect';

const ProductFormModal = ({ isOpen, onClose, editingProduct }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const content = useSelector((state) => state.content || {});

    const [productFormData, setProductFormData] = useState({
        name: '', brand: '', category: 'Men', price: '', discount: 0, discountEndTime: '', isNew: false, sizes: [], images: []
    });
    const [newSizeInput, setNewSizeInput] = useState({ size: '', stock: '' });

    useEffect(() => {
        if (editingProduct) {
            setProductFormData({
                ...editingProduct,
                sizes: editingProduct.sizes || [],
                images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : []),
                discountEndTime: editingProduct.discountEndTime || ''
            });
        } else {
            setProductFormData({
                name: '',
                brand: content.brands?.[0]?.name || '',
                category: 'Men',
                price: '',
                images: [],
                discount: 0,
                discountEndTime: '',
                isNew: true,
                sizes: []
            });
        }
    }, [editingProduct, isOpen, content.brands]);

    if (!isOpen) return null;

    const handleProductSubmit = (e) => {
        e.preventDefault();

        if (!productFormData.brand) {
            alert(t('admin.select_brand_error'));
            return;
        }

        const priceNum = Number(String(productFormData.price).replace(',', '.'));
        if (isNaN(priceNum) || priceNum <= 0) {
            alert(t('admin.invalid_price_error'));
            return;
        }

        let finalSizes = [...productFormData.sizes];
        if (newSizeInput.size && newSizeInput.stock) {
            const s = Number(newSizeInput.size);
            const st = Number(newSizeInput.stock);

            // Size Validation removed as per user request to allow kids sizes
            if (s <= 0) {
                alert(t('admin.invalid_size_error') || 'Invalid size');
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
            discountEndTime: productFormData.discountEndTime || '',
            image: mainImage,
            images: finalImages,
            sizes: finalSizes,
            isNew: Boolean(productFormData.isNew)
        };

        if (editingProduct) {
            dispatch(updateProduct(payload));
            alert(t('admin.product_updated_success'));
        } else {
            dispatch(addProduct(payload));
            alert(t('admin.product_added_success'));
        }
        setNewSizeInput({ size: '', stock: '' });
        onClose();
    };

    const handleAddSize = () => {
        if (!newSizeInput.size || !newSizeInput.stock) return;
        const sizeNum = Number(newSizeInput.size);
        const stockNum = Number(newSizeInput.stock);

        // Size Validation removed to allow kids sizes
        if (sizeNum <= 0) {
            alert(t('admin.invalid_size_error') || 'Invalid size');
            return;
        }

        if (productFormData.sizes.some(s => s.size === sizeNum)) {
            alert(t('admin.size_already_exists'));
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

    const brandOptions = content.brands?.map(b => ({ value: b.name, label: b.name })) || [];
    const categoryOptions = [
        { value: "Men", label: t('nav.men') },
        { value: "Women", label: t('nav.women') },
        { value: "Kids", label: t('nav.kids') }
    ];

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-backdrop" onClick={onClose} />
            <div className="admin-modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2>{editingProduct ? t('common.edit') : t('admin.new')}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X size={24} /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="admin-form">
                    <div className="admin-grid-full">
                        <label className="admin-label">{t('admin.name')}</label>
                        <input className="admin-input" value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} required />
                    </div>
                    <div>
                        <MobileSheetSelect
                            label={t('admin.brand')}
                            value={productFormData.brand}
                            onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                            options={brandOptions}
                            placeholder={`-- ${t('admin.select')} --`}
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">{t('admin.price')}</label>
                        <input type="number" className="admin-input" value={productFormData.price} onChange={e => setProductFormData({ ...productFormData, price: e.target.value })} required />
                    </div>
                    <div>
                        <MobileSheetSelect
                            label={t('admin.category')}
                            value={productFormData.category}
                            onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                            options={categoryOptions}
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">{t('admin.discount_percentage')}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="admin-input"
                            value={productFormData.discount}
                            onChange={e => setProductFormData({ ...productFormData, discount: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="admin-label">{t('admin.discount_end_time')}</label>
                        <input
                            type="datetime-local"
                            className="admin-input"
                            value={productFormData.discountEndTime ? new Date(productFormData.discountEndTime).toISOString().slice(0, 16) : ''}
                            onChange={e => {
                                if (e.target.value) {
                                    setProductFormData({ ...productFormData, discountEndTime: new Date(e.target.value).toISOString() });
                                } else {
                                    setProductFormData({ ...productFormData, discountEndTime: '' });
                                }
                            }}
                        />
                    </div>
                    <div className="admin-grid-full">
                        <MultiImageInput
                            images={productFormData.images}
                            onChange={newImages => setProductFormData({ ...productFormData, images: newImages })}
                        />
                    </div>
                    <div className="admin-grid-full">
                        <h4 className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {t('admin.sizes_stock')}
                            <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: '0.6' }}>{productFormData.sizes.length} {t('admin.sizes_added')}</span>
                        </h4>

                        <div className="admin-add-size-row">
                            <div className="admin-size-input-group">
                                <input
                                    type="number"
                                    placeholder={t('admin.size_placeholder')}
                                    className="admin-input"
                                    value={newSizeInput.size}
                                    onChange={e => setNewSizeInput({ ...newSizeInput, size: e.target.value })}
                                />
                            </div>
                            <div className="admin-size-input-group">
                                <input
                                    type="number"
                                    placeholder={t('admin.stock_placeholder')}
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
                    <button type="submit" className="btn-primary admin-grid-full">{t('common.save')}</button>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
