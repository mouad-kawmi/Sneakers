import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Eye, X, Calendar, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { updateOrderStatus } from '../../../store/slices/ordersSlice';
import { restoreStock } from '../../../store/slices/productSlice';

const OrderStatusDropdown = ({ currentStatus, onStatusChange }) => {
    const { t } = useTranslation();
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#ffa502';
            case 'Processing': return '#3742fa';
            case 'Shipped': return '#2ed573';
            case 'Delivered': return '#1e90ff';
            case 'Cancelled': return '#ff4757';
            default: return '#747d8c';
        }
    };

    const isFinalState = currentStatus === 'Delivered' || currentStatus === 'Cancelled';

    return (
        <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={isFinalState}
            style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: `1px solid ${getStatusColor(currentStatus)}`,
                color: getStatusColor(currentStatus),
                fontWeight: '600',
                background: 'var(--bg-card)',
                cursor: isFinalState ? 'not-allowed' : 'pointer',
                opacity: isFinalState ? 0.7 : 1
            }}
        >
            {statuses.map(s => <option key={s} value={s}>{t(`orders.${s.toLowerCase()}`)}</option>)}
        </select>
    );
};

const OrderManager = ({ orders }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [viewingOrder, setViewingOrder] = useState(null);

    // Filters & Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState({ start: '', end: '', preset: 'all' });
    const [searchQuery, setSearchQuery] = useState('');
    const ordersPerPage = 10;

    const presets = [
        { id: 'all', label: t('orders.all') },
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
        { id: 'custom', label: 'Custom' }
    ];

    const applyPreset = (presetId) => {
        const now = new Date();
        let start = '';
        let end = '';

        if (presetId === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            start = today.toISOString().split('T')[0];
            end = start;
        } else if (presetId === 'week') {
            const lastWeek = new Date();
            lastWeek.setDate(now.getDate() - 7);
            start = lastWeek.toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        } else if (presetId === 'month') {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            start = firstDay.toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        }

        setDateFilter({ start, end, preset: presetId });
        setCurrentPage(1);
    };

    // 1. Apply Search & Date Filter
    const filteredOrders = orders.filter(order => {
        // Search Filter
        const customerName = (order.customer?.fullName || order.customer?.name || '').toLowerCase();
        const orderId = order.id.toString();
        const matchesSearch = customerName.includes(searchQuery.toLowerCase()) || orderId.includes(searchQuery);

        if (!matchesSearch) return false;

        // Date Filter
        if (!dateFilter.start && !dateFilter.end) return true;
        const orderDate = new Date(order.date).getTime();
        const start = dateFilter.start ? new Date(dateFilter.start).setHours(0, 0, 0, 0) : 0;
        const end = dateFilter.end ? new Date(dateFilter.end).setHours(23, 59, 59, 999) : Infinity;
        return orderDate >= start && orderDate <= end;
    });

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="admin-section">
            <div className="admin-orders-header">
                <div className="admin-orders-top">
                    <h2 className="admin-section-title">{t('admin.orders')}</h2>
                    <div className="admin-order-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Order ID / Customer..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                <div className="admin-presets-scroll">
                    <div className="admin-preset-tabs">
                        {presets.map(p => (
                            <button
                                key={p.id}
                                className={`preset-tab ${dateFilter.preset === p.id ? 'active' : ''}`}
                                onClick={() => applyPreset(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {dateFilter.preset === 'custom' && (
                        <motion.div
                            className="admin-custom-range-bar"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="range-inputs">
                                <div className="range-field">
                                    <span>From:</span>
                                    <input
                                        type="date"
                                        value={dateFilter.start}
                                        onChange={(e) => { setDateFilter(prev => ({ ...prev, start: e.target.value })); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="range-field">
                                    <span>To:</span>
                                    <input
                                        type="date"
                                        value={dateFilter.end}
                                        onChange={(e) => { setDateFilter(prev => ({ ...prev, end: e.target.value })); setCurrentPage(1); }}
                                    />
                                </div>
                                {(dateFilter.start || dateFilter.end) && (
                                    <button onClick={() => applyPreset('all')} className="range-reset">Clear</button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="admin-table-wrapper hide-mobile">
                <table className="admin-table">
                    <thead>
                        <tr><th className="admin-th">{t('admin.id')}</th><th className="admin-th">{t('admin.customer')}</th><th className="admin-th">{t('admin.shipping_address')}</th><th className="admin-th">{t('admin.total')}</th><th className="admin-th">{t('admin.status')}</th><th className="admin-th">{t('admin.actions')}</th></tr>
                    </thead>
                    <tbody>
                        {currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                                    {t('admin.no_orders_found')}
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map(o => (
                                <tr key={o.id}>
                                    <td className="admin-td">#{o.id}</td>
                                    <td className="admin-td">
                                        <div style={{ fontWeight: 700 }}>
                                            {o.customer?.fullName || o.customer?.name || `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || t('admin.unknown_client')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '2px' }}>
                                            {o.customer?.email}
                                        </div>
                                    </td>
                                    <td className="admin-td">
                                        {o.customer?.address ? (
                                            <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{o.customer.address}</div>
                                                <div style={{ color: 'var(--text-gray)' }}>
                                                    {o.customer.city}, {o.customer.postalCode}
                                                </div>
                                                <div style={{ color: 'var(--text-gray)', fontSize: '11px', marginTop: '4px' }}>
                                                    📞 {o.customer.phone}
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{t('admin.not_available')}</span>
                                        )}
                                    </td>
                                    <td className="admin-td" style={{ fontWeight: 700 }}>{o.total} DH</td>
                                    <td className="admin-td">
                                        <OrderStatusDropdown
                                            currentStatus={o.status}
                                            onStatusChange={(newStatus) => {
                                                if (newStatus === 'Cancelled' && o.status !== 'Cancelled') {
                                                    const stockPayload = o.items.map(item => ({
                                                        id: item.id,
                                                        size: item.size,
                                                        quantity: item.quantity
                                                    }));
                                                    dispatch(restoreStock(stockPayload));
                                                }
                                                dispatch(updateOrderStatus({ id: o.id, status: newStatus }));
                                            }}
                                        />
                                    </td>
                                    <td className="admin-td">
                                        <button
                                            onClick={() => setViewingOrder(o)}
                                            className="admin-action-btn edit"
                                            title={t('admin.view_details')}
                                            style={{ background: 'rgba(55, 66, 250, 0.1)', color: '#3742fa' }}
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="show-mobile admin-mobile-cards">
                {currentOrders.length === 0 ? (
                    <div className="admin-empty-text">{t('admin.no_orders_found')}</div>
                ) : (
                    currentOrders.map(o => (
                        <div key={o.id} className="admin-mobile-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>#{o.id}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{new Date(o.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontWeight: 700, fontSize: '15px' }}>{o.customer?.fullName || o.customer?.name || t('admin.unknown_client')}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-gray)', wordBreak: 'break-all' }}>{o.customer?.phone}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '4px', wordBreak: 'break-word' }}>{o.customer?.city}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontWeight: 800, fontSize: '16px' }}>{o.total} DH</div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <OrderStatusDropdown
                                        currentStatus={o.status}
                                        onStatusChange={(newStatus) => {
                                            if (newStatus === 'Cancelled' && o.status !== 'Cancelled') {
                                                const stockPayload = o.items.map(item => ({
                                                    id: item.id,
                                                    size: item.size,
                                                    quantity: item.quantity
                                                }));
                                                dispatch(restoreStock(stockPayload));
                                            }
                                            dispatch(updateOrderStatus({ id: o.id, status: newStatus }));
                                        }}
                                    />
                                    <button
                                        onClick={() => setViewingOrder(o)}
                                        className="admin-action-btn edit"
                                        style={{ background: 'rgba(55, 66, 250, 0.1)', color: '#3742fa' }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Professional Pagination */}
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

            {/* Order Details Modal */}
            <AnimatePresence>
                {viewingOrder && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-backdrop" onClick={() => setViewingOrder(null)} />
                        <motion.div
                            className="admin-modal-content"
                            style={{ maxWidth: '700px' }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700 }}>
                                    <h2 style={{ margin: 0 }}>{t('admin.order_details')}</h2>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>#{viewingOrder.id}</span>
                                </div>
                                <button onClick={() => setViewingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div className="admin-order-details-grid">
                                <div>
                                    <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>{t('admin.customer_info')}</h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                                            {viewingOrder.customer?.fullName || viewingOrder.customer?.name || t('admin.unknown_client')}
                                        </div>
                                        <div style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '12px' }}>{viewingOrder.customer?.email}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                                            <span>📞 {viewingOrder.customer?.phone || 'N/A'}</span>
                                            <span>📍 {viewingOrder.customer?.address}, {viewingOrder.customer?.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>{t('admin.summary')}</h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>{t('admin.date_label')}:</span>
                                            <span style={{ fontWeight: 600 }}>{new Date(viewingOrder.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>{t('admin.payment')}:</span>
                                            <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{viewingOrder.paymentMethod || 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 800, fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span>{t('admin.total_label')}:</span>
                                            <span>{viewingOrder.total} DH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>{t('admin.articles')} ({viewingOrder.items?.length || 0})</h4>
                            <div className="admin-order-items-list hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                {viewingOrder.items?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                                        <img src={item.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{t('cart.size')}: {item.size} | {t('admin.price')}: {item.price} DH</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>x{item.quantity}</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.price * item.quantity} DH</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManager;
