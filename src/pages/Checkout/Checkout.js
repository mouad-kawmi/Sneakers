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
import { clearCart } from '../../store/slices/cartSlice';
import { reduceStock } from '../../store/slices/productSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { generateOrderPdf } from '../../services/PdfService';
import { useToast } from '../../context/ToastContext';
import CheckoutProgress from './components/CheckoutProgress';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const cart = useSelector((state) => state.cart);
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
        if (!formData.fullName) newErrors.fullName = "Requis";
        if (!formData.email.includes('@')) newErrors.email = "Email invalide";
        if (formData.phone.length < 10) newErrors.phone = "Numéro invalide";
        if (!formData.address) newErrors.address = "Requis";
        if (paymentMethod === 'card') {
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = "16 chiffres requis";
            if (!formData.expiry.includes('/')) newErrors.expiry = "MM/YY requis";
            if (formData.cvv.length !== 3) newErrors.cvv = "3 chiffres";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
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
            showToast("Veuillez vérifier les champs du formulaire", "error");
            return;
        }
        const newOrderId = `SN-${Math.floor(Math.random() * 90000) + 10000}`;
        const newOrder = {
            id: newOrderId,
            date: new Date().toISOString(),
            status: 'Processing',
            total: cart.totalAmount,
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

        showToast("Commande confirmée avec succès!", "success");

        setCurrentOrder(newOrder);
        setStep('success');
    };

    if (step === 'success' && currentOrder) {
        return (
            <div className="container checkout-success-page">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="checkout-success-card">
                    <div className="checkout-success-icon"><CheckCircle2 size={64} color="#2ED573" /></div>
                    <h1 className="checkout-success-title">Commande Confirmée !</h1>
                    <p className="checkout-success-msg">
                        Merci pour votre confiance. Votre commande <strong>{currentOrder.id}</strong> est en cours de préparation.
                    </p>

                    <div className="checkout-email-confirmation" style={{
                        background: 'rgba(var(--bg-card-rgb), 0.4)',
                        padding: '16px',
                        borderRadius: '12px',
                        margin: '20px 0',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ background: 'var(--primary)', borderRadius: '50%', padding: '8px', display: 'flex', flexShrink: 0 }}>
                                <CheckCircle2 size={20} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)', fontSize: '15px', fontWeight: '700' }}>
                                    📧 Email de confirmation envoyé
                                </h4>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                                    Un email de confirmation a été envoyé à <strong>{currentOrder.customer.email}</strong> avec les détails de votre commande.
                                </p>
                                <div style={{
                                    background: 'var(--bg-app)',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: 'var(--text-gray)'
                                }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong style={{ color: 'var(--primary)' }}>Numéro de commande:</strong> {currentOrder.id}
                                    </div>
                                    <div>
                                        💡 Utilisez ce numéro pour suivre votre commande dans <strong>Mon Espace</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-pdf-section">
                        <div className="checkout-pdf-info">
                            <FileText size={24} color="var(--primary)" />
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontWeight: 800, margin: 0, fontSize: '14px' }}>Reçu de commande</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-gray)', margin: 0 }}>Format PDF • Haute Qualité</p>
                            </div>
                        </div>
                        <button onClick={() => generateOrderPdf(currentOrder)} className="checkout-download-btn"><Download size={18} /> Télécharger maintenant</button>
                    </div>
                    <div className="checkout-tracking-hint">
                        <p>Conservez votre numéro de commande pour le suivi.</p>
                        <button onClick={() => navigate('/help?tab=faq')} className="checkout-secondary-btn">Besoin d'aide ?</button>
                    </div>
                    <button onClick={() => navigate('/')} className="checkout-primary-btn">Continuer mes achats <ArrowRight size={20} /></button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container checkout-page">
            <button onClick={() => navigate(-1)} className="checkout-back-btn"><ChevronLeft size={20} /> Retour au panier</button>
            <CheckoutProgress currentStep={step} />
            <div className="checkout-grid">
                <div className="checkout-main-content">
                    <form onSubmit={handleCheckout}>
                        <section className="checkout-section">
                            <h2 className="checkout-section-title"><Truck size={22} /> Informations de Livraison</h2>

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
                                        📍 {showAddressSelector ? 'Masquer' : 'Choisir'} une adresse enregistrée ({user.addresses.length})
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
                                                            PAR DÉFAUT
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
                                                            ✓ Adresse sélectionnée
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
                                    <label className="checkout-label">Nom complet</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className={`checkout-input ${errors.fullName ? 'error' : ''}`} placeholder="Mbarek SBERDILA" />
                                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={`checkout-input ${errors.email ? 'error' : ''}`} placeholder="contact@sberdila.com" />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">Téléphone</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className={`checkout-input ${errors.phone ? 'error' : ''}`} placeholder="+212 600 000 000" />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </div>
                                <div className="checkout-input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="checkout-label">Adresse</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} className={`checkout-input ${errors.address ? 'error' : ''}`} placeholder="123 Boulevard Mohammed V" />
                                    {errors.address && <span className="error-text">{errors.address}</span>}
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">Ville</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="checkout-input" placeholder="Casablanca" />
                                </div>
                                <div className="checkout-input-group">
                                    <label className="checkout-label">Code Postal</label>
                                    <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="checkout-input" placeholder="20000" />
                                </div>
                            </div>
                        </section>
                        <section className="checkout-section">
                            <h2 className="checkout-section-title"><CreditCard size={22} aria-hidden="true" /> Méthode de Paiement</h2>
                            <div className="checkout-payment-methods" role="radiogroup" aria-label="Choisir une méthode de paiement">
                                <div onClick={() => setPaymentMethod('card')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'card'}><input type="radio" checked={paymentMethod === 'card'} readOnly aria-label="Carte Bancaire" /><span>Carte Bancaire</span></div>
                                <div onClick={() => setPaymentMethod('paypal')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'paypal' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'paypal'}><input type="radio" checked={paymentMethod === 'paypal'} readOnly aria-label="PayPal" /><span>PayPal</span></div>
                                <div onClick={() => setPaymentMethod('cod')} className="checkout-pay-card" style={{ borderColor: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-subtle)' }} role="radio" aria-checked={paymentMethod === 'cod'}><input type="radio" checked={paymentMethod === 'cod'} readOnly aria-label="Paiement à la livraison" /><span>Paiement à la livraison</span></div>
                            </div>
                            {paymentMethod === 'card' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="checkout-card-form">
                                    <div className="checkout-input-group">
                                        <label className="checkout-label">Numéro de carte</label>
                                        <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className={`checkout-input ${errors.cardNumber ? 'error' : ''}`} placeholder="0000 0000 0000 0000" />
                                        {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                                    </div>
                                    <div className="checkout-form-grid">
                                        <div className="checkout-input-group">
                                            <label className="checkout-label">Expiration</label>
                                            <input required name="expiry" value={formData.expiry} onChange={handleInputChange} className={`checkout-input ${errors.expiry ? 'error' : ''}`} placeholder="MM/YY" />
                                            {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                                        </div>
                                        <div className="checkout-input-group">
                                            <label className="checkout-label">CVV</label>
                                            <input required name="cvv" value={formData.cvv} onChange={handleInputChange} className={`checkout-input ${errors.cvv ? 'error' : ''}`} placeholder="123" />
                                            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </section>
                        <button type="submit" className="checkout-final-submit-btn">Confirmer la commande <ArrowRight size={20} /></button>
                    </form>
                </div>
                <aside className="checkout-sidebar">
                    <div className="checkout-summary-card">
                        <h3 className="checkout-side-title">Résumé de la commande</h3>
                        <div className="checkout-item-list">
                            {cart.items.map(item => (
                                <div key={item.id} className="checkout-summary-item">
                                    <div className="checkout-item-img-box"><img src={item.image} alt={item.name} className="checkout-item-img" /><span className="checkout-item-qty">{item.quantity}</span></div>
                                    <div style={{ flex: 1 }}><h4 className="checkout-item-name">{item.name}</h4><span className="checkout-item-details">Taille: {item.size}</span></div>
                                    <span className="checkout-item-price">{item.price * item.quantity} DH</span>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-pricing">
                            <div className="checkout-price-row"><span>Sous-total</span><span>{cart.totalAmount} DH</span></div>
                            <div className="checkout-price-row"><span>Livraison</span><span style={{ color: '#2ED573' }}>Gratuite</span></div>
                            <div className="checkout-divider"></div>
                            <div className="checkout-price-row" style={{ fontWeight: 900, fontSize: '20px' }}><span>TOTAL</span><span style={{ color: 'var(--primary)' }}>{cart.totalAmount} DH</span></div>
                        </div>
                        <div className="checkout-trust-badge"><ShieldCheck size={18} /><span>Paiement 100% sécurisé</span></div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
