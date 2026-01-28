import React from 'react';
import { TrendingUp, ShoppingBag, Star, Package, AlertTriangle, Edit } from 'lucide-react';

const DashboardStats = ({ orders, products, onOpenProductModal }) => {
    const totalRevenue = orders
        .filter(order => order.status !== 'Cancelled')
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const lowStockProducts = products.filter(p => (p.sizes || []).some(s => s.stock < 5));
    const totalStock = products.reduce((total, p) => total + (p.sizes || []).reduce((sum, s) => sum + s.stock, 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(46, 213, 115, 0.1)', color: '#2ED573' }}><TrendingUp size={24} /></div>
                    <div><h3 className="admin-stat-label">Revenu Total</h3><p className="admin-stat-value">{totalRevenue.toLocaleString()} DH</p></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(55, 66, 250, 0.1)', color: '#3742fa' }}><ShoppingBag size={24} /></div>
                    <div><h3 className="admin-stat-label">Commandes</h3><p className="admin-stat-value">{orders.length}</p></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#FF4757' }}><Star size={24} /></div>
                    <div><h3 className="admin-stat-label">Produits</h3><p className="admin-stat-value">{products.length}</p></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255, 165, 2, 0.1)', color: '#ffa502' }}><Package size={24} /></div>
                    <div><h3 className="admin-stat-label">Stock Total</h3><p className="admin-stat-value">{totalStock}</p></div>
                </div>
            </div>

            <div className="admin-section">
                <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4757' }}>
                    <AlertTriangle size={24} /> Alertes Stock Faible
                </h2>
                {lowStockProducts.length > 0 ? (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr><th className="admin-th">Image</th><th className="admin-th">Produit</th><th className="admin-th">Tailles</th><th className="admin-th">Action</th></tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="admin-td"><img src={product.image} style={{ width: '50px', height: '50px', borderRadius: '8px' }} alt="" /></td>
                                        <td className="admin-td" style={{ fontWeight: 600 }}>{product.name}</td>
                                        <td className="admin-td">
                                            {product.sizes.filter(s => s.stock < 5).map(s => (
                                                <span
                                                    key={s.size}
                                                    className="admin-stock-badge"
                                                    style={{
                                                        background: s.stock === 0 ? '#FF4757' : '#ffa502'
                                                    }}
                                                >
                                                    T{s.size}: {s.stock}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="admin-td"><button onClick={() => onOpenProductModal(product)} className="admin-action-btn edit" title="Modifier"><Edit size={14} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p style={{ color: 'var(--text-gray)' }}>Stock OK. 👍</p>}
            </div>
        </div>
    );
};

export default DashboardStats;
