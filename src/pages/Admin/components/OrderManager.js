import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { updateOrderStatus } from '../../../store/slices/ordersSlice';
import { restoreStock } from '../../../store/slices/productSlice';

const OrderStatusDropdown = ({ currentStatus, onStatusChange }) => {
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
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
    );
};

const OrderManager = ({ orders }) => {
    const dispatch = useDispatch();
    const [viewingOrder, setViewingOrder] = useState(null);

    return (
        <div className="admin-section">
            <h2 className="admin-section-title">Commandes</h2>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th className="admin-th">ID</th><th className="admin-th">Client</th><th className="admin-th">Adresse de Livraison</th><th className="admin-th">Total</th><th className="admin-th">Statut</th><th className="admin-th">Actions</th></tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                                    Aucune commande trouvée.
                                </td>
                            </tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o.id}>
                                    <td className="admin-td">#{o.id}</td>
                                    <td className="admin-td">
                                        <div style={{ fontWeight: 700 }}>
                                            {o.customer?.fullName || o.customer?.name || `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Client Inconnu'}
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
                                            <span style={{ color: 'var(--text-gray)', fontSize: '12px' }}>Non disponible</span>
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
                                            title="Voir les détails"
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

            {/* Order Details Modal */}
            <AnimatePresence>
                {viewingOrder && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-backdrop" onClick={() => setViewingOrder(null)} />
                        <div className="admin-modal-content" style={{ maxWidth: '700px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ margin: 0 }}>Détails de la Commande</h2>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>#{viewingOrder.id}</span>
                                </div>
                                <button onClick={() => setViewingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div className="admin-order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <div>
                                    <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>Informations Client</h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                                            {viewingOrder.customer?.fullName || viewingOrder.customer?.name || 'Client Inconnu'}
                                        </div>
                                        <div style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '12px' }}>{viewingOrder.customer?.email}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                                            <span>📞 {viewingOrder.customer?.phone || 'N/A'}</span>
                                            <span>📍 {viewingOrder.customer?.address}, {viewingOrder.customer?.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>Résumé</h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>Date:</span>
                                            <span style={{ fontWeight: 600 }}>{new Date(viewingOrder.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>Paiement:</span>
                                            <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{viewingOrder.paymentMethod || 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 800, fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span>Total:</span>
                                            <span>{viewingOrder.total} DH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '12px', opacity: 0.6, fontSize: '13px', textTransform: 'uppercase' }}>Articles ({viewingOrder.items?.length || 0})</h4>
                            <div className="admin-order-items-list hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                {viewingOrder.items?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                                        <img src={item.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Taille: {item.size} | Prix: {item.price} DH</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>x{item.quantity}</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.price * item.quantity} DH</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManager;
