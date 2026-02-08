import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Download, Upload, Trash2 } from 'lucide-react';
import { setContent } from '../../../store/slices/contentSlice';
import { setOrders } from '../../../store/slices/ordersSlice';
import { setProducts } from '../../../store/slices/productSlice';
import { setReviews } from '../../../store/slices/reviewSlice';

const SettingsManager = ({ products, content, reviews, orders }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleExportData = () => {
        const data = { products, content, reviews, orders, timestamp: new Date().toISOString() };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `backup_sberdila_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportData = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.products && data.content) {
                        if (window.confirm(t('admin.replace_data_confirm'))) {
                            dispatch(setProducts(data.products || []));
                            dispatch(setContent(data.content || {}));
                            dispatch(setReviews(data.reviews || []));
                            dispatch(setOrders(data.orders || []));
                            alert(t('admin.data_restored_success'));
                            window.location.reload();
                        }
                    } else {
                        alert(t('admin.invalid_format_error'));
                    }
                } catch (error) {
                    alert(t('admin.read_error'));
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="admin-section">
            <h2 className="admin-section-title">{t('profile.settings')}</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button onClick={handleExportData} className="btn-primary" style={{ background: '#1976d2' }}><Download size={18} /> {t('admin.export_data')}</button>
                <label className="btn-primary" style={{ background: '#2e7d32', cursor: 'pointer' }}>
                    <Upload size={18} /> {t('admin.import_data')}
                    <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
                </label>
                <button
                    onClick={() => {
                        if (window.confirm(t('admin.reset_store_confirm'))) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                    className="btn-primary"
                    style={{ background: '#ff4757' }}
                >
                    <Trash2 size={18} /> {t('admin.reset_store')}
                </button>
            </div>
        </div>
    );
};

export default SettingsManager;
