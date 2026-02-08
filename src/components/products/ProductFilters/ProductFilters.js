import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../../../store/slices/productSlice';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import './ProductFilters.css';

const ProductFilters = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.products?.filters || { minPrice: 0, maxPrice: 10000, sizes: [], brand: 'All', category: 'All' });
    const products = useSelector((state) => state.products?.items || []);

    const [minPrice, setMinPrice] = useState(filters?.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState(filters?.maxPrice || 10000);

    useEffect(() => {
        setMinPrice(filters.minPrice);
        setMaxPrice(filters.maxPrice);
    }, [filters.minPrice, filters.maxPrice]);

    // Extract unique brands and sizes
    const allBrandsList = useSelector((state) => state.content?.brands || []);
    const allBrands = allBrandsList.map(b => b.name);
    const allSizes = Array.from(new Set((products || []).flatMap(p => p?.sizes?.map(s => s.size) || []))).sort((a, b) => a - b);

    const handleApplyPrice = () => {
        dispatch(setFilters({ minPrice, maxPrice }));
    };

    const handleSizeToggle = (size) => {
        const currentSizes = filters?.sizes || [];
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];
        dispatch(setFilters({ sizes: newSizes }));
    };

    return (
        <aside className={`product-filters ${isOpen ? 'open' : ''}`}>
            <div className="filters-header-mobile">
                <h3>{t('filters.title')}</h3>
                <button onClick={onClose} className="close-filters-btn"><X size={24} /></button>
            </div>

            <div className="filters-content">
                {/* Category Section */}
                <div className="filter-section">
                    <h4 className="section-title">{t('filters.categories')}</h4>
                    <div className="category-options">
                        {['All', 'Men', 'Women', 'Kids'].map(cat => (
                            <label key={cat} className="brand-radio">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={filters.category === cat}
                                    onChange={() => dispatch(setFilters({ category: cat }))}
                                />
                                <span className="radio-dot"></span>
                                {cat === 'All' ? t('orders.all') : cat === 'Men' ? t('nav.men') : cat === 'Women' ? t('nav.women') : t('nav.kids')}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brand Section - Radio style as per mockup */}
                <div className="filter-section">
                    <h4 className="section-title">{t('filters.brands')}</h4>
                    <div className="brand-options">
                        <label className="brand-radio">
                            <input
                                type="radio"
                                name="brand"
                                checked={filters.brand === 'All'}
                                onChange={() => dispatch(setFilters({ brand: 'All' }))}
                            />
                            <span className="radio-dot"></span>
                            {t('orders.all')}
                        </label>
                        {allBrands.map(brand => (
                            <label key={brand} className="brand-radio">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={filters.brand === brand}
                                    onChange={() => dispatch(setFilters({ brand }))}
                                />
                                <span className="radio-dot"></span>
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Section */}
                <div className="filter-section">
                    <h4 className="section-title">{t('filters.price')}</h4>
                    <div className="price-inputs-row">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                        />
                        <span className="price-separator">-</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <button className="apply-price-btn btn-animate" onClick={handleApplyPrice}>
                        {t('filters.apply')}
                    </button>
                </div>

                {/* Size Section */}
                <div className="filter-section">
                    <h4 className="section-title">{t('filters.sizes')}</h4>
                    <div className="size-grid-refined">
                        {allSizes.map(size => (
                            <button
                                key={size}
                                className={`size-btn-refined ${(filters?.sizes || []).includes(size) ? 'active' : ''} btn-animate`}
                                onClick={() => handleSizeToggle(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="reset-all-btn btn-animate" onClick={() => dispatch(clearFilters())}>
                    {t('filters.reset_all')}
                </button>
            </div>
        </aside>
    );
};

export default ProductFilters;
