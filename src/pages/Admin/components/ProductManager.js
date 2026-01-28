import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { deleteProduct } from '../../../store/slices/productSlice';
import { useToast } from '../../../context/ToastContext';

const ProductManager = ({ products, onOpenProductModal }) => {
    const { showToast } = useToast();
    const dispatch = useDispatch();

    const handleProductDelete = (id) => {
        dispatch(deleteProduct(Number(id)));
        showToast("Produit supprimé avec succès. Product Deleted Successfully!", "success");
    };

    return (
        <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 className="admin-section-title">Gestion des Produits</h2>
                <button onClick={() => onOpenProductModal(null)} className="btn-primary" style={{ padding: '10px 20px' }}><Plus size={20} /> Nouveau</button>
            </div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th className="admin-th">Image</th><th className="admin-th">Nom</th><th className="admin-th">Marque</th><th className="admin-th">Prix</th><th className="admin-th">Stock</th><th className="admin-th">Actions</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td className="admin-td"><img src={p.image} style={{ width: '50px', height: '50px', borderRadius: '8px' }} alt="" /></td>
                                <td className="admin-td" style={{ fontWeight: 600 }}>{p.name}</td>
                                <td className="admin-td">{p.brand}</td>
                                <td className="admin-td" style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.price} DH</td>
                                <td className="admin-td">
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {(p.sizes || []).map(s => (
                                            <span
                                                key={s.size}
                                                className="admin-stock-badge"
                                                style={{
                                                    background: s.stock === 0 ? '#FF4757' : '#ffa502',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                T{s.size}: {s.stock}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="admin-td">
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => onOpenProductModal(p)} className="admin-action-btn edit" title="Modifier"><Edit size={18} /></button>
                                        <button onClick={() => handleProductDelete(p.id)} className="admin-action-btn delete" title="Supprimer"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;
