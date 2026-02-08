import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../../../store/slices/cartSlice';
import { clearFilters } from '../../../store/slices/productSlice';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import EmptyState from '../../layout/EmptyState/EmptyState';
import ProductFilters from '../ProductFilters/ProductFilters';
import './AllProducts.css';

const ProductCard = lazy(() => import('../ProductCard/ProductCard'));
const ProductCardSkeleton = lazy(() => import('../ProductCard/ProductCardSkeleton'));

const AllProducts = () => {
    const { t } = useTranslation();
    const { items: products = [], filters = { brand: 'All', category: 'All', search: '', minPrice: 0, maxPrice: 10000, sizes: [] }, sorting = 'newest' } = useSelector((state) => state.products || {});
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const itemsPerPage = 9;

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [filters, sorting]);

    const allItems = (products || []).filter(item => {
        const matchesCategory = filters.category === 'All' || item.category === filters.category;
        const matchesBrand = filters.brand === 'All' || item.brand === filters.brand;
        const matchesSearch = !filters.search ||
            item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.brand.toLowerCase().includes(filters.search.toLowerCase());

        const finalPrice = item.price * (1 - (item.discount || 0) / 100);
        const matchesPrice = finalPrice >= filters.minPrice && finalPrice <= filters.maxPrice;

        const matchesSizes = (filters.sizes?.length || 0) === 0 ||
            item.sizes?.some(s => filters.sizes.includes(s.size) && s.stock > 0);

        return matchesCategory && matchesBrand && matchesSearch && matchesPrice && matchesSizes;
    }).sort((a, b) => {
        const priceA = a.price * (1 - (a.discount || 0) / 100);
        const priceB = b.price * (1 - (b.discount || 0) / 100);

        if (sorting === 'price-low') return priceA - priceB;
        if (sorting === 'price-high') return priceB - priceA;
        if (sorting === 'newest') return b.id - a.id;
        return 0;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = allItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        const section = document.getElementById('all-products-section');
        if (section) {
            const offset = section.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const getTitle = () => {
        if (filters.search) return t('products_list.results_for', { query: filters.search });
        if (filters.brand !== 'All') return t('products_list.products_brand', { brand: filters.brand });
        if (filters.category !== 'All') {
            const categoryName =
                filters.category === 'Men' ? t('nav.men') :
                    filters.category === 'Women' ? t('nav.women') :
                        filters.category === 'Kids' ? t('nav.kids') :
                            filters.category;
            return t('products_list.collection', { category: categoryName });
        }
        return t('products_list.all_products');
    };

    return (
        <div id="all-products-section" className="container all-products-page">
            <div className="all-products-toolbar">
                <div className="toolbar-left">
                    <h2 className="all-products-title">{getTitle()}</h2>
                    <span className="product-count">{t('brands.products_count', { count: allItems.length })}</span>
                </div>

                <div className="toolbar-right">
                    <button className="mobile-filter-btn btn-animate" onClick={() => setIsFilterOpen(true)}>
                        <SlidersHorizontal size={18} /> {t('products_list.filters')}
                    </button>

                    <div className="sort-wrapper">
                        <select
                            className="sort-select"
                            value={sorting}
                            onChange={(e) => dispatch({ type: 'products/setSorting', payload: e.target.value })}
                        >
                            <option value="newest">{t('orders.all')}</option>
                            <option value="price-low">{t('products_list.price_low')}</option>
                            <option value="price-high">{t('products_list.price_high')}</option>
                        </select>
                        <ChevronDown size={16} className="sort-icon" />
                    </div>
                </div>
            </div>

            <div className="all-products-layout">
                <ProductFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

                <div className="products-main-content">
                    {isLoading ? (
                        <div className="all-products-grid">
                            <Suspense fallback={null}>
                                {[...Array(6)].map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </Suspense>
                        </div>
                    ) : allItems.length === 0 ? (
                        <EmptyState
                            icon={Search}
                            title={t('products_list.no_products')}
                            description={t('products_list.no_products_desc')}
                            ctaText={t('products_list.clear_filters')}
                            onCtaClick={() => dispatch(clearFilters())}
                        />
                    ) : (
                        <>
                            <div className="all-products-grid">
                                <Suspense fallback={null}>
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={(p) => dispatch(addToCart(p))}
                                        />
                                    ))}
                                </Suspense>
                            </div>

                            {totalPages > 1 && (
                                <div className="all-products-pagination">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`all-products-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;

