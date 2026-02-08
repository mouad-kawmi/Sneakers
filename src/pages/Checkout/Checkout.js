import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Truck,
    ShieldCheck,
    ChevronLeft,
    CheckCircle2,
    Download,
    FileText,
    ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clearCart } from '../../store/slices/cartSlice';
import { reduceStock } from '../../store/slices/productSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { generateOrderPdf } from '../../services/PdfService';
import { useToast } from '../../context/ToastContext';
import CheckoutProgress from './components/CheckoutProgress';
import SmartImage from '../../components/layout/SmartImage/SmartImage';
import './Checkout.css';
import './CheckoutSuccess.css';

const Checkout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const cart = useSelector((state) => state.cart);
    // Calculate total dynamically from items to avoid corrupted state
    const cartTotal = cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const { user } = useSelector((state) => state.auth);
    const [step, setStep] = useState('shipping');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', cardNumber: '', expiry: '', cvv: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!formData?.fullName) newErrors.fullName = t('checkout.required');
        if (!formData?.email?.includes('@')) newErrors.email = t('checkout.invalid_email');
        if ((formData?.phone || '').length < 10) newErrors.phone = t('checkout.invalid_phone');
        if (!formData?.address) newErrors.address = t('checkout.required');

        if (paymentMethod === 'card') {
            const cardNumber = formData?.cardNumber || '';
            const expiry = formData?.expiry || '';
            const cvv = formData?.cvv || '';

            if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = t('checkout.card_number_error');
            if (!expiry.includes('/')) newErrors.expiry = t('checkout.expiry_error');
            if (cvv.length !== 3) newErrors.cvv = t('checkout.cvv_error');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'fullName':
                if (!value) error = t('checkout.required');
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('checkout.invalid_email');
                break;
            case 'phone':
                if (value.length < 10) error = t('checkout.invalid_phone');
                break;
            case 'address':
                if (!value) error = t('checkout.required');
                break;
            case 'cardNumber':
                if (paymentMethod === 'card' && value.replace(/\s/g, '').length !== 16) error = t('checkout.card_number_error');
                break;
            case 'expiry':
                if (paymentMethod === 'card' && !/^\d{2}\/\d{2}$/.test(value)) error = t('checkout.invalid_expiry');
                break;
            case 'cvv':
                if (paymentMethod === 'card' && value.length !== 3) error = t('checkout.cvv_error');
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const fieldError = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cart.items.length === 0 && step !== 'success') {
            navigate('/');
        }
    }, [cart.items.length, navigate, step]);

    useEffect(() => {
        if (user?.addresses && user.addresses.length > 0 && !formData.fullName) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            fillAddressForm(defaultAddr);
            setSelectedAddressId(defaultAddr.id);
        }
    }, [user]);

    const fillAddressForm = (address) => {
        setFormData(prev => ({
            ...prev,
            fullName: address.fullName || user?.name || '',
            email: user?.email || '',
            phone: address.phone || '',
            address: address.address1 || '',
            city: address.city || '',
            postalCode: address.postalCode || ''
        }));
        setShowAddressSelector(false);
    };

    const [currentOrder, setCurrentOrder] = useState(null);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast(t('checkout.check_fields'), "error");
            return;
        }
        const newOrderId = `SN-${Math.floor(Math.random() * 90000) + 10000}`;
        const newOrder = {
            id: newOrderId,
            date: new Date().toISOString(),
            status: 'Processing',
            total: cartTotal,
            items: cart.items,
            customer: {
                ...formData,
                email: (user?.email || formData.email || '').trim().toLowerCase()
            },
            paymentMethod,
            history: [{ status: 'Processing', date: new Date().toISOString() }]
        };

        // 1. Save Order
        dispatch(addOrder(newOrder));

        // 2. Reduce Stock
        dispatch(reduceStock(cart.items.map(item => ({ id: item.id, size: item.size, quantity: item.quantity }))));

        // 3. Clear Cart
        dispatch(clearCart());

        showToast(t('checkout.confirm_success'), "success", null, t('common.order').toUpperCase());

        setCurrentOrder(newOrder);
        setStep('success');
    };

    if (step === 'success' && currentOrder) {
        return (
            <div className="container checkout-success-page">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="checkout-success-card">
                    <div className="checkout-success-icon"><CheckCircle2 size={64} color="#2ED573" /></div>
                    <h1 className="checkout-success-title">{t('checkout.success_title')}</h1>
                    <p className="checkout-success-msg">
                        {t('checkout.success_msg', { id: currentOrder.id })}
                    </p>

                    <div className="checkout-email-confirmation">
                        <div className="checkout-email-info-flex">
                            <div className="checkout-email-icon-box">
                                <CheckCircle2 size={20} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 className="checkout-email-title">
                                    📧 {t('checkout.email_sent')}
                                </h4>
                                <p className="checkout-email-text">
                                    {t('checkout.email_desc', { email: currentOrder.customer.email })}
                                </p>
                                <div className="checkout-order-details-box">
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong style={{ color: 'var(--primary)' }}>{t('checkout.order_number')}</strong> {currentOrder.id}
                                    </div>
                                    <div>
                                        💡 {t('checkout.tracking_hint')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-pdf-section">
                        <div className="checkout-pdf-info">
                            <FileText size={24} color="var(--primary)" />
                            <div className="checkout-pdf-text-box">
                                <p className="checkout-pdf-title">{t('checkout.receipt')}</p>
                                <p className="checkout-pdf-format">{t('checkout.pdf_format')}</p>
                            </div>
                        </div>
                        <button onClick={() => generateOrderPdf(currentOrder)} className="checkout-download-btn"><Download size={18} /> {t('checkout.download')}</button>
                    </div>
                    <div className="checkout-tracking-hint">
                        <p>{t('checkout.keep_number')}</p>
                        <button onClick={() => navigate('/help?tab=faq')} className="checkout-secondary-btn">{t('checkout.need_help')}</button>
                    </div>
                    <button onClick={() => navigate('/')} className="checkout-primary-btn">{t('cart.continue_shopping')} <ArrowRight size={20} /></button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container checkout-page">
            <button onClick={() => navigate(-1)} className="checkout-back-btn"><ChevronLeft size={20} /> {t('checkout.back_cart')}</button>
            <CheckoutProgress currentStep={step} />
            <div className="checkout-grid">
                <div className="checkout-main-content">
                    <form onSubmit={handleCheckout}>
                        <section className="checkout-section">
                            <h2 className="checkout-section-title"><Truck size={22} /> {t('checkout.shipping_info')}</h2>

                            {/* Saved Addresses Selector */}
                            {user?.addresses && user.addresses.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressSelector(!showAddressSelector)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '2px solid var(--primary)',
                                            background: 'rgba(147, 51, 234, 0.05)',
                                            color: 'var(--primary)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        📍 {showAddressSelector ? t('checkout.hide') : t('checkout.choose')} {t('checkout.saved_address')} ({user.addresses.length})
                                    </button>

                                    {showAddressSelector && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{
                                                marginTop: '16px',
                                                display: 'grid',
                                                gap: '12px',
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                padding: '4px'
                                            }}
                                        >
                                            {user.addresses.map(addr => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => {
                                                        fillAddressForm(addr);
                                                        setSelectedAddressId(addr.id);
                                                    }}
                                                    style={{
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: selectedAddressId === addr.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                                                        background: selectedAddressId === addr.id ? 'rgba(147, 51, 234, 0.05)' : 'var(--bg-card)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {addr.isDefault && (
                                                        <span style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            right: '12px',
                                                            background: 'var(--primary)',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            fontSize: '10px',
                                                            fontWeight: '700'
                                                        }}>
                                                            {t('profile.default')}
                                                        </span>
                                                    )}
                                                    <div style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>{addr.fullName}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.5' }}>
                                                        <div>{addr.address1}</div>
                                                        {addr.address2 && <div>{addr.address2}</div>}
                                                        <div>{addr.city}, {addr.postalCode}</div>
                                                        <div style={{ marginTop: '4px' }}>📞 {addr.phone}</div>
                                                    </div>
                                                    {selectedAddressId === addr.id && (
                                                        <div style={{
                                                            marginTop: '12px',
                                                            padding: '8px 12px',
                                                            background: 'var(--primary)',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            textAlign: 'center'
                                                        }}>
                                                            ✓ {t('checkout.selected_address')}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            <div className="checkout-form-grid">
                                <div className="checkout-input-group">
                                    <label className="checkout-label">{t('profile.full_name')}</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className={`checkout-input ${errors.fullName ? 'error' : ''}`} placeholder="" />
                                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">{t('profile.email')}</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={`checkout-input ${errors.email ? 'error' : ''}`} placeholder="" />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">{t('profile.phone')}</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className={`checkout-input ${errors.phone ? 'error' : ''}`} placeholder="" />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </div>
                                <div className="checkout-input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="checkout-label">{t('profile.address')}</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} className={`checkout-input ${errors.address ? 'error' : ''}`} placeholder="" />
                                    {errors.address && <span className="error-text">{errors.address}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">{t('profile.city')}</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="checkout-input" placeholder="" />
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">{t('profile.postal_code')}</label>
                                    <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="checkout-input" placeholder="" />
                                </div>
                            </div>
                        </section>
                        <section className="checkout-section">
                            <h2 className="checkout-section-title"><CreditCard size={22} aria-hidden="true" /> {t('checkout.payment_method')}</h2>
                            <div className="checkout-payment-methods" role="radiogroup" aria-label={t('checkout.payment_method')}>
                                <div onClick={() => setPaymentMethod('card')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'card'}><input type="radio" checked={paymentMethod === 'card'} readOnly aria-label={t('checkout.credit_card')} /><span>{t('checkout.credit_card')}</span></div>
                                <div onClick={() => setPaymentMethod('paypal')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'paypal' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'paypal'}><input type="radio" checked={paymentMethod === 'paypal'} readOnly aria-label={t('checkout.paypal')} /><span>{t('checkout.paypal')}</span></div>
                                <div onClick={() => setPaymentMethod('cod')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'cod'}><input type="radio" checked={paymentMethod === 'cod'} readOnly aria-label={t('checkout.cod')} /><span>{t('checkout.cod')}</span></div>
                            </div>
                            {paymentMethod === 'card' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="checkout-card-form">
                                    <div className="checkout-input-group">
                                        <label className="checkout-label">{t('checkout.card_number')}</label>
                                        <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className={`checkout-input ${errors.cardNumber ? 'error' : ''}`} placeholder="0000 0000 0000 0000" />
                                        {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                                    </div>
                                    <div className="checkout-form-grid">
                                        <div className="checkout-input-group">
                                            <label className="checkout-label">{t('checkout.expiry')}</label>
                                            <input required name="expiry" value={formData.expiry} onChange={handleInputChange} className={`checkout-input ${errors.expiry ? 'error' : ''}`} placeholder="MM/YY" />
                                            {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                                        </div>
                                        <div className="checkout-input-group">
                                            <label className="checkout-label">{t('checkout.cvv')}</label>
                                            <input required name="cvv" value={formData.cvv} onChange={handleInputChange} className={`checkout-input ${errors.cvv ? 'error' : ''}`} placeholder="123" />
                                            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </section>
                        <button type="submit" className="checkout-final-submit-btn">{t('checkout.confirm_order')} <ArrowRight size={20} /></button>
                    </form>
                </div>
                <aside className="checkout-sidebar">
                    <div className="checkout-summary-card">
                        <h3 className="checkout-side-title">{t('checkout.order_summary')}</h3>
                        <div className="checkout-item-list">
                            {cart.items.map(item => (
                                <div key={item.id} className="checkout-summary-item">
                                    <div className="checkout-item-img-box"><SmartImage src={item.image} alt={item.name || 'Product'} className="checkout-item-img" /><span className="checkout-item-qty">{item.quantity}</span></div>
                                    <div style={{ flex: 1 }}><h4 className="checkout-item-name">{item.name || 'Product'}</h4><span className="checkout-item-details">{t('cart.size')}: {item.size || 'N/A'}</span></div>
                                    <span className="checkout-item-price">{(item.price || 0) * (item.quantity || 1)} DH</span>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-pricing">
                            <div className="checkout-price-row"><span>{t('cart.subtotal')}</span><span>{cartTotal.toFixed(2)} DH</span></div>
                            <div className="checkout-price-row"><span>{t('cart.shipping')}</span><span style={{ color: '#2ED573' }}>{t('cart.free')}</span></div>
                            <div className="checkout-divider"></div>
                            <div className="checkout-price-row" style={{ fontWeight: 900, fontSize: '20px' }}><span>{t('cart.total')}</span><span style={{ color: 'var(--primary)' }}>{cartTotal.toFixed(2)} DH</span></div>
                        </div>
                        <div className="checkout-trust-badge"><ShieldCheck size={18} /><span>{t('checkout.secure_payment')}</span></div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
