import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import EmptyState from '../../../components/layout/EmptyState/EmptyState';

const OrderHistory = ({ user }) => {
    const orders = useSelector(state => state.orders.items);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [visibleOrders, setVisibleOrders] = useState(5);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

    const myOrders = orders.filter(o => {
        if (!o.customer) return false;

        // Check email (case-insensitive)
        const emailMatch = user.email && o.customer.email &&
            o.customer.email.toLowerCase() === user.email.toLowerCase();

        // Check name fields: fullName, name, nom (case-insensitive, partial match)
        const fullNameMatch = user.name && o.customer.fullName &&
            o.customer.fullName.toLowerCase().includes(user.name.toLowerCase());
        const nameMatch = user.name && o.customer.name &&
            o.customer.name.toLowerCase().includes(user.name.toLowerCase());
        const nomMatch = user.name && o.customer.nom &&
            o.customer.nom.toLowerCase().includes(user.name.toLowerCase());

        return emailMatch || fullNameMatch || nameMatch || nomMatch;
    });

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Processing': return { icon: Clock, color: '#ffa502', bg: 'rgba(255, 165, 2, 0.1)', label: 'En traitement' };
            case 'Shipped': return { icon: Truck, color: '#3742fa', bg: 'rgba(55, 66, 250, 0.1)', label: 'Expédiée' };
            case 'Delivered': return { icon: CheckCircle, color: '#2ed573', bg: 'rgba(46, 213, 115, 0.1)', label: 'Livrée' };
            case 'Cancelled': return { icon: XCircle, color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', label: 'Annulée' };
            default: return { icon: Clock, color: '#747d8c', bg: '#f1f2f6', label: status };
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>Historique des Commandes</h2>

            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                    { value: 'all', label: 'Tous', icon: Package },
                    { value: 'Processing', label: 'En traitement', icon: Clock },
                    { value: 'Shipped', label: 'Expédiée', icon: Truck },
                    { value: 'Delivered', label: 'Livrée', icon: CheckCircle },
                    { value: 'Cancelled', label: 'Annulée', icon: XCircle }
                ].map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => {
                            setOrderStatusFilter(value);
                            setVisibleOrders(5); // Reset visible orders when filter changes
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            background: orderStatusFilter === value ? 'var(--primary)' : 'var(--bg-card)',
                            color: orderStatusFilter === value ? 'white' : 'var(--text-gray)',
                            border: orderStatusFilter === value ? 'none' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Sorting Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: '600', marginRight: '8px' }}>Trier par :</span>
                {[
                    { value: 'newest', label: 'Plus récent' },
                    { value: 'oldest', label: 'Plus ancien' }
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setSortOrder(value)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            background: sortOrder === value ? 'var(--text-main)' : 'transparent',
                            color: sortOrder === value ? 'var(--bg-card)' : 'var(--text-gray)',
                            border: `1px solid ${sortOrder === value ? 'var(--text-main)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {(() => {
                // Filter and Sort orders
                let processedOrders = orderStatusFilter === 'all'
                    ? [...myOrders]
                    : myOrders.filter(o => o.status === orderStatusFilter);

                // Apply Sorting
                processedOrders.sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                });

                return processedOrders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title={orderStatusFilter === 'all' ? "Aucune commande pour le moment" : "Aucun résultat trouvé"}
                        description={orderStatusFilter === 'all'
                            ? "Vous n'avez pas encore passé de commande sur notre boutique."
                            : `Aucune commande avec le statut "${getStatusConfig(orderStatusFilter).label}" n'a été trouvée.`
                        }
                    />
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {processedOrders.slice(0, visibleOrders).map(order => {
                            const status = getStatusConfig(order.status);
                            return (
                                <div key={order.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-clean)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div>
                                            <span style={{ fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>Commande #{order.id}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: status.bg, color: status.color, fontSize: '13px', fontWeight: '600' }}>
                                            <status.icon size={16} /> {status.label}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <div key={i} style={{ position: 'relative' }}>
                                                <img src={item.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-app)' }} />
                                                <span style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary)', color: 'white', fontSize: '10px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)', fontWeight: 'bold' }}>
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-gray)' }}>Total</span>
                                            <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>{order.total} DH</span>
                                        </div>
                                        {/* Optional: Add reorder or details button here */}
                                    </div>
                                </div>
                            );
                        })}

                        {processedOrders.length > visibleOrders && (
                            <button
                                onClick={() => setVisibleOrders(prev => prev + 5)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    border: '2px dashed var(--border-subtle)',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                    e.currentTarget.style.color = 'var(--text-main)';
                                }}
                            >
                                Voir plus de commandes
                            </button>
                        )}
                    </div>
                );
            })()}
        </motion.div>
    );
};

export default OrderHistory;
