import React, { useState } from 'react';
import { TrendingUp, ShoppingBag, Star, Package, AlertTriangle, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DashboardStats = ({ orders, products, onOpenProductModal }) => {
    const { t } = useTranslation();
    const totalRevenue = orders
        .filter(order => order.status !== 'Cancelled')
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const lowStockProducts = products.filter(p => (p.sizes || []).some(s => s.stock < 5));
    const totalStock = products.reduce((total, p) => total + (p.sizes || []).reduce((sum, s) => sum + s.stock, 0), 0);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(lowStockProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentLowStock = lowStockProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(46, 213, 115, 0.1)', color: '#2ED573' }}><TrendingUp size={24} /></div>
                    <div className="admin-stat-info">
                        <h3 className="admin-stat-label">{t('admin.total_revenue')}</h3>
                        <p className="admin-stat-value">{totalRevenue.toLocaleString()} DH</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(55, 66, 250, 0.1)', color: '#3742fa' }}><ShoppingBag size={24} /></div>
                    <div className="admin-stat-info">
                        <h3 className="admin-stat-label">{t('admin.orders')}</h3>
                        <p className="admin-stat-value">{orders.length}</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#FF4757' }}><Star size={24} /></div>
                    <div className="admin-stat-info">
                        <h3 className="admin-stat-label">{t('admin.products')}</h3>
                        <p className="admin-stat-value">{products.length}</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255, 165, 2, 0.1)', color: '#ffa502' }}><Package size={24} /></div>
                    <div className="admin-stat-info">
                        <h3 className="admin-stat-label">{t('admin.total_stock')}</h3>
                        <p className="admin-stat-value">{totalStock}</p>
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h2 className="admin-section-title danger-row">
                        <AlertTriangle size={24} /> {t('admin.low_stock_alerts')}
                    </h2>
                </div>

                {lowStockProducts.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="admin-table-wrapper hide-mobile-flex">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th className="admin-th">{t('admin.image')}</th>
                                        <th className="admin-th">{t('admin.product')}</th>
                                        <th className="admin-th">{t('filters.sizes')}</th>
                                        <th className="admin-th">{t('admin.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentLowStock.map(product => (
                                        <tr key={product.id}>
                                            <td className="admin-td">
                                                <div className="admin-table-img-wrap">
                                                    <img src={product.image} alt="" />
                                                </div>
                                            </td>
                                            <td className="admin-td font-bold">{product.name}</td>
                                            <td className="admin-td">
                                                <div className="admin-stock-list">
                                                    {product.sizes.filter(s => s.stock < 5).map(s => (
                                                        <span key={s.size} className={`admin-stock-badge ${s.stock === 0 ? 'out' : ''}`}>
                                                            T{s.size}: {s.stock}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="admin-td">
                                                <button onClick={() => onOpenProductModal(product)} className="admin-action-btn edit" title={t('common.edit')}>
                                                    <Edit size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List View */}
                        <div className="show-mobile admin-mobile-cards">
                            {currentLowStock.map(product => (
                                <div key={product.id} className="admin-mobile-card low-stock">
                                    <div className="admin-mobile-card-top">
                                        <div className="admin-mobile-card-img">
                                            <img src={product.image} alt="" />
                                        </div>
                                        <div className="admin-mobile-card-info">
                                            <h4 className="admin-mobile-card-name">{product.name}</h4>
                                            <div className="admin-stock-list">
                                                {product.sizes.filter(s => s.stock < 5).map(s => (
                                                    <span key={s.size} className={`admin-stock-badge ${s.stock === 0 ? 'out' : ''}`}>
                                                        T{s.size}: {s.stock}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => onOpenProductModal(product)} className="admin-action-btn edit">
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                    </>
                ) : (
                    <p className="admin-empty-text">{t('admin.stock_ok')}</p>
                )}
            </div>
        </div>
    );
};

export default DashboardStats;

