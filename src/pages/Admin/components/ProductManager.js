import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { deleteProduct } from '../../../store/slices/productSlice';
import { useToast } from '../../../context/ToastContext';

const ProductManager = ({ products, onOpenProductModal }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const dispatch = useDispatch();

    // Filters & Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const productsPerPage = 10;

    const filters = [
        { id: 'all', label: t('orders.all') },
        { id: 'instock', label: t('admin.stock_ok') },
        { id: 'lowstock', label: t('admin.low_stock') },
        { id: 'outofstock', label: t('common.out_of_stock') }
    ];

    const handleProductDelete = (id) => {
        if (window.confirm(t('admin.confirm_delete_product'))) {
            dispatch(deleteProduct(Number(id)));
            showToast(t('admin.product_deleted_success'), "success");
        }
    };

    // 1. Apply Search & Status Filter
    const filteredProducts = products.filter(p => {
        // Search Filter
        const name = p.name.toLowerCase();
        const brand = p.brand.toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase()) || brand.includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Stock Filter
        const totalStock = (p.sizes || []).reduce((sum, s) => sum + s.stock, 0);
        const hasLowStock = (p.sizes || []).some(s => s.stock < 5 && s.stock > 0);

        if (activeFilter === 'instock') return totalStock > 0;
        if (activeFilter === 'outofstock') return totalStock === 0;
        if (activeFilter === 'lowstock') return hasLowStock;

        return true;
    });

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1);
    };

    return (
        <div className="admin-section">
            <div className="admin-orders-header">
                <div className="admin-orders-top">
                    <h2 className="admin-section-title">{t('admin.product_management')}</h2>
                    <div className="admin-order-search" style={{ maxWidth: '400px' }}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <button onClick={() => onOpenProductModal(null)} className="btn-primary admin-header-btn">
                        <Plus size={20} /> <span className="hide-mobile">{t('admin.new_product')}</span>
                    </button>
                </div>

                <div className="admin-presets-scroll">
                    <div className="admin-preset-tabs">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                className={`preset-tab ${activeFilter === f.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-wrapper hide-mobile-flex">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="admin-th">{t('admin.image')}</th>
                            <th className="admin-th">{t('admin.name')}</th>
                            <th className="admin-th">{t('admin.brand')}</th>
                            <th className="admin-th">{t('admin.price')}</th>
                            <th className="admin-th">{t('admin.stock')}</th>
                            <th className="admin-th">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                                    {t('admin.no_results_found')}
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map(p => (
                                <tr key={p.id}>
                                    <td className="admin-td">
                                        <div className="admin-table-img-wrap">
                                            <img src={p.image} alt="" />
                                        </div>
                                    </td>
                                    <td className="admin-td font-bold">{p.name}</td>
                                    <td className="admin-td">{p.brand}</td>
                                    <td className="admin-td font-primary-bold">{p.price} DH</td>
                                    <td className="admin-td">
                                        <div className="admin-stock-list">
                                            {(p.sizes || []).map(s => (
                                                <span key={s.size} className={`admin-stock-badge ${s.stock === 0 ? 'out' : ''}`}>
                                                    T{s.size}: {s.stock}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="admin-td">
                                        <div className="admin-table-actions">
                                            <button onClick={() => onOpenProductModal(p)} className="admin-action-btn edit" title={t('common.edit')}><Edit size={18} /></button>
                                            <button onClick={() => handleProductDelete(p.id)} className="admin-action-btn delete" title={t('common.delete')}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="admin-mobile-cards show-mobile">
                {currentProducts.length === 0 ? (
                    <div className="admin-empty-text">{t('admin.no_results_found')}</div>
                ) : (
                    currentProducts.map(p => (
                        <div key={p.id} className="admin-mobile-card">
                            <div className="admin-mobile-card-top">
                                <div className="admin-mobile-card-img">
                                    <img src={p.image} alt="" />
                                </div>
                                <div className="admin-mobile-card-info">
                                    <h4 className="admin-mobile-card-name">{p.name}</h4>
                                    <p className="admin-mobile-card-brand">{p.brand}</p>
                                    <p className="admin-mobile-card-price">{p.price} DH</p>
                                </div>
                            </div>
                            <div className="admin-mobile-card-stock">
                                <div className="admin-stock-list">
                                    {(p.sizes || []).map(s => (
                                        <span key={s.size} className={`admin-stock-badge ${s.stock === 0 ? 'out' : ''}`}>
                                            T{s.size}: {s.stock}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="admin-mobile-card-actions">
                                <button onClick={() => onOpenProductModal(p)} className="admin-mobile-action-btn edit">
                                    <Edit size={16} /> {t('common.edit')}
                                </button>
                                <button onClick={() => handleProductDelete(p.id)} className="admin-mobile-action-btn delete">
                                    <Trash2 size={16} /> {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-btn"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="pagination-numbers">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-btn"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductManager;

