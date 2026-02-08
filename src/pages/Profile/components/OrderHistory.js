import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/layout/EmptyState/EmptyState';

const OrderHistory = ({ user }) => {
    const { t, i18n } = useTranslation();
    const orders = useSelector(state => state.orders.items);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [visibleOrders, setVisibleOrders] = useState(5);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

    const myOrders = orders.filter(o => {
        if (!o.customer || !user) return false;

        const userEmail = (user.email || '').trim().toLowerCase();
        const userName = (user.name || '').trim().toLowerCase();

        const customerEmail = (o.customer.email || '').trim().toLowerCase();
        const customerFullName = (o.customer.fullName || '').trim().toLowerCase();
        const customerName = (o.customer.name || '').trim().toLowerCase();
        const customerNom = (o.customer.nom || '').trim().toLowerCase();

        // 1. Primary Match: Email (Most reliable)
        const emailMatch = userEmail && customerEmail && customerEmail === userEmail;

        // 2. Secondary Match: Name (Fallback or enrichment)
        const fullNameMatch = userName && customerFullName && customerFullName.includes(userName);
        const nameMatch = userName && customerName && customerName.includes(userName);
        const nomMatch = userName && customerNom && customerNom.includes(userName);

        return emailMatch || fullNameMatch || nameMatch || nomMatch;
    });

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Processing': return { icon: Clock, color: '#ffa502', bg: 'rgba(255, 165, 2, 0.1)', label: t('orders.processing') };
            case 'Shipped': return { icon: Truck, color: '#3742fa', bg: 'rgba(55, 66, 250, 0.1)', label: t('orders.shipped') };
            case 'Delivered': return { icon: CheckCircle, color: '#2ed573', bg: 'rgba(46, 213, 115, 0.1)', label: t('orders.delivered') };
            case 'Cancelled': return { icon: XCircle, color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', label: t('orders.cancelled') };
            default: return { icon: Clock, color: '#747d8c', bg: '#f1f2f6', label: status };
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="order-history-title">{t('orders.history')}</h2>

            {/* Status Filter Tabs */}
            <div className="order-filter-tabs">
                {[
                    { value: 'all', label: t('orders.all'), icon: Package },
                    { value: 'Processing', label: t('orders.processing'), icon: Clock },
                    { value: 'Shipped', label: t('orders.shipped'), icon: Truck },
                    { value: 'Delivered', label: t('orders.delivered'), icon: CheckCircle },
                    { value: 'Cancelled', label: t('orders.cancelled'), icon: XCircle }
                ].map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => {
                            setOrderStatusFilter(value);
                            setVisibleOrders(5);
                        }}
                        className={`order-filter-btn ${orderStatusFilter === value ? 'active' : ''}`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="order-sorting-row">
                <span className="sort-label">{t('common.sort_by')} :</span>
                <div className="sort-options">
                    {[
                        { value: 'newest', label: t('common.newest') },
                        { value: 'oldest', label: t('common.oldest') }
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setSortOrder(value)}
                            className={`sort-badge-btn ${sortOrder === value ? 'active' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {(() => {
                let processedOrders = orderStatusFilter === 'all'
                    ? [...myOrders]
                    : myOrders.filter(o => o.status === orderStatusFilter);

                processedOrders.sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                });

                return processedOrders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title={t('orders.no_orders')}
                        description={orderStatusFilter === 'all'
                            ? t('orders.no_orders_desc')
                            : t('orders.no_orders_status_desc', { status: getStatusConfig(orderStatusFilter).label })
                        }
                    />
                ) : (
                    <div className="orders-list">
                        {processedOrders.slice(0, visibleOrders).map(order => {
                            const status = getStatusConfig(order.status);
                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-info">
                                            <span className="order-id">{t('orders.order')} #{order.id}</span>
                                            <span className="order-date">{new Date(order.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                                        </div>
                                        <div className="order-status-badge" style={{ background: status.bg, color: status.color }}>
                                            <status.icon size={14} /> {status.label}
                                        </div>
                                    </div>
                                    <div className="order-items-preview">
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <div key={i} className="order-item-thumbnail">
                                                <img src={item.image} alt="" />
                                                <span className="order-item-qty">{item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="order-items-more">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-card-footer">
                                        <div className="order-total-box">
                                            <span className="order-total-label">{t('orders.total')}</span>
                                            <span className="order-total-amount">{order.total} DH</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {processedOrders.length > visibleOrders && (
                            <button
                                onClick={() => setVisibleOrders(prev => prev + 5)}
                                className="order-load-more-btn"
                            >
                                {t('orders.load_more')}
                            </button>
                        )}
                    </div>
                );
            })()}
        </motion.div>
    );
};

export default OrderHistory;
