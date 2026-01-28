import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/productSlice';
import './BrandCategories.css';

const BrandCategories = ({ category = 'All' }) => {
    const dispatch = useDispatch();
    const brands = useSelector((state) => state.content.brands);
    const products = useSelector(state => state.products?.items || []);
    const currentFilters = useSelector(state => state.products?.filters || { brand: 'All', category: 'All' });

    const handleBrandClick = (brandName) => {
        const productsSection = document.getElementById('all-products-section');
        if (productsSection) {
            const offset = productsSection.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
        dispatch(setFilters({ brand: brandName, category: category }));
    };

    const getProductCount = (brandName) => {
        if (!Array.isArray(products)) return 0;
        return products.filter(p => {
            const matchesBrand = p && p.brand === brandName;
            const matchesCategory = category === 'All' || p.category === category;
            return matchesBrand && matchesCategory;
        }).length;
    };

    return (
        <div className="container brand-categories-container">
            <div className="brand-categories-header">
                <h2 className="brand-categories-title">Parcourir par Marque</h2>
                <button
                    onClick={() => dispatch(clearFilters())}
                    className="brand-view-all-btn"
                >
                    Voir Tout <ArrowUpRight size={18} />
                </button>
            </div>

            <div className="brand-grid">
                {brands.map((brand) => {
                    const isActive = currentFilters.brand === brand.name;
                    return (
                        <div
                            key={brand.name}
                            onClick={() => handleBrandClick(brand.name)}
                            style={{ background: brand.gradient }}
                            className={`brand-card ${isActive ? 'active' : ''}`}
                        >
                            <div className="brand-card-bg-text">
                                {brand.name[0]}
                            </div>

                            <div className="brand-card-content">
                                <div className="brand-logo-wrapper">
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const fallback = e.target.parentElement.querySelector('.brand-fallback');
                                                if (fallback) fallback.style.display = 'block';
                                            }}
                                            className="brand-card-logo"
                                        />
                                    ) : null}
                                    <span
                                        className="brand-fallback"
                                        style={{ display: brand.logo ? 'none' : 'block' }}
                                    >
                                        {brand.name}
                                    </span>
                                </div>

                                <div className="brand-product-count">
                                    {getProductCount(brand.name)} Produits
                                </div>
                            </div>

                            <div className="brand-voir-collection">
                                Voir <ArrowUpRight size={12} />
                            </div>

                            <div className="brand-card-overlay" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BrandCategories;
