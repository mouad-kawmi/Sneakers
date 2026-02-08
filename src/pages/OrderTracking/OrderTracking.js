import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './OrderTracking.css';

const OrderTracking = () => {
    const { t } = useTranslation();
    const orders = useSelector(state => state.orders.items);
    const [orderId, setOrderId] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setIsLoading(true);
        const foundOrder = orders.find(o => o.id === orderId.trim());
        setTimeout(() => {
            if (foundOrder) {
                const steps = [
                    { label: t('tracking.step_confirmed'), status: 'Processing', icon: Package },
                    { label: t('tracking.step_prep'), status: 'Processing', icon: Clock },
                    { label: t('tracking.step_shipped'), status: 'Shipped', icon: Truck },
                    { label: t('tracking.step_delivered'), status: 'Delivered', icon: CheckCircle }
                ];
                const statusLevels = { 'Processing': 1, 'Shipped': 2, 'Delivered': 3, 'Cancelled': -1 };
                const currentLevel = statusLevels[foundOrder.status] || 0;
                const processedSteps = steps.map((step, index) => {
                    const stepLevel = index <= 1 ? 1 : (index === 2 ? 2 : 3);
                    const isCompleted = currentLevel >= stepLevel;
                    return {
                        ...step,
                        date: isCompleted ? (foundOrder.history?.find(h => h.status === step.status)?.date || foundOrder.date).slice(0, 10) : '-',
                        completed: isCompleted
                    };
                });
                setTrackingResult({ ...foundOrder, estimatedDelivery: t('tracking.days_range'), steps: processedSteps });
            } else {
                setTrackingResult(null);
                alert(t('tracking.not_found'));
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="container order-tracking-page">
            <header className="order-tracking-header">
                <h1 className="order-tracking-title">{t('tracking.title')}</h1>
                <p className="order-tracking-subtitle">{t('tracking.subtitle')}</p>
            </header>
            <div className="order-tracking-search-box">
                <form onSubmit={handleTrack} className="order-tracking-form">
                    <input type="text" placeholder={t('tracking.placeholder')} value={orderId} onChange={(e) => setOrderId(e.target.value)} className="order-tracking-input" />
                    <button type="submit" className="order-tracking-button" disabled={isLoading}>{isLoading ? t('tracking.searching') : <><Search size={20} /> {t('tracking.track_btn')}</>}</button>
                </form>
            </div>
            {trackingResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="order-tracking-result-card">
                    <div className="order-tracking-result-header">
                        <div><h2 className="order-tracking-order-label">{t('orders.order')} #{trackingResult.id}</h2><span className="order-tracking-date-label">{t('tracking.order_placed', { date: trackingResult.date })}</span></div>
                        <div className="order-tracking-status-badge" style={{ color: trackingResult.status === 'Cancelled' ? '#FF4757' : '#2ED573', background: trackingResult.status === 'Cancelled' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(46, 213, 115, 0.1)', borderColor: trackingResult.status === 'Cancelled' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)' }}>{trackingResult.status}</div>
                    </div>
                    <div className="order-tracking-timeline">
                        {trackingResult.steps.map((step, index) => (
                            <div key={index} className="order-tracking-step">
                                <div className="order-tracking-icon-container">
                                    <div className="order-tracking-icon-circle" style={{ backgroundColor: step.completed ? 'var(--primary)' : 'var(--bg-app)', color: step.completed ? 'white' : 'var(--text-gray)' }}><step.icon size={20} /></div>
                                    {index < trackingResult.steps.length - 1 && <div className="order-tracking-line" style={{ backgroundColor: step.completed ? 'var(--primary)' : 'var(--bg-app)' }} />}
                                </div>
                                <div className="order-tracking-step-content">
                                    <h3 className="order-tracking-step-label" style={{ color: step.completed ? 'var(--text-main)' : 'var(--text-gray)' }}>{step.label}</h3>
                                    <span className="order-tracking-step-date">{step.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="order-tracking-delivery-info"><h4 className="order-tracking-info-title">{t('tracking.estimated')}</h4><p className="order-tracking-info-date">{trackingResult.estimatedDelivery}</p></div>
                </motion.div>
            )}
        </div>
    );
};

export default OrderTracking;
