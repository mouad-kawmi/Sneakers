import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import './CheckoutProgress.css';

const CheckoutProgress = ({ currentStep }) => {
    const { t } = useTranslation();
    const steps = [
        { id: 'cart', label: t('checkout_progress.cart'), icon: ShoppingCart },
        { id: 'shipping', label: t('checkout_progress.shipping'), icon: Truck },
        { id: 'payment', label: t('checkout_progress.payment'), icon: CreditCard },
        { id: 'success', label: t('checkout_progress.confirmation'), icon: CheckCircle2 }
    ];

    const getCurrentStepIndex = () => {
        return steps.findIndex(s => s.id === currentStep);
    };

    const currentIndex = getCurrentStepIndex();

    return (
        <div className="checkout-progress-wrapper">
            <div className="checkout-progress-container">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;

                    return (
                        <React.Fragment key={step.id}>
                            <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                <div className="step-icon-box">
                                    <Icon size={20} />
                                    {isCompleted && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="step-check"
                                        >
                                            <CheckCircle2 size={12} fill="var(--primary)" color="white" />
                                        </motion.div>
                                    )}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`progress-connector ${index < currentIndex ? 'filled' : ''}`}>
                                    <div className="connector-line"></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutProgress;
