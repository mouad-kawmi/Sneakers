import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addBrand } from '../../store/slices/contentSlice';
import { initializeDemoOrders, markOrdersAsRead } from '../../store/slices/ordersSlice';
import { setProducts, addProduct, deleteProduct, updateProduct, restoreStock } from '../../store/slices/productSlice';
import { markAllAsRead, initializeDemoMessages } from '../../store/slices/messageSlice';
import { ShoppingBag, Star, Truck, BarChart2, Package, Settings, MessageSquare, Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

// Components
import DashboardStats from './components/DashboardStats';
import ProductManager from './components/ProductManager';
import OrderManager from './components/OrderManager';
import MessageManager from './components/MessageManager';
import SettingsManager from './components/SettingsManager';
import ProductFormModal from './components/ProductFormModal';
import HeroSlideEditor from './components/HeroSlideEditor';
import PromoEditor from './components/PromoEditor';
import BrandEditor from './components/BrandEditor';
import ReviewManager from './components/ReviewManager';

import './Admin.css';

const Admin = () => {
    const { t } = useTranslation();
    const products = useSelector((state) => state.products?.items || []);
    const reviews = useSelector((state) => state.reviews?.items || []);
    const content = useSelector((state) => state.content || {});
    const orders = useSelector((state) => state.orders?.items || []);
    const messages = useSelector((state) => state.messages?.items || []);
    const unreadMessagesCount = useSelector((state) => state.messages?.unreadCount || 0);
    const unreadOrdersCount = useSelector((state) => state.orders?.unreadOrdersCount || 0);
    const { isAuthenticated, user } = useAuth();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        dispatch(initializeDemoOrders());
        dispatch(initializeDemoMessages());
    }, [dispatch]);

    if (!isAuthenticated || user?.role !== 'admin') return <Navigate to={ROUTES.HOME} />;

    const handleOpenProductModal = (product = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
        if (activeTab !== 'products') {
            setActiveTab('products');
        }
    };

    return (
        <div className="container admin-page">
            <div className="admin-header">
                <h1 className="admin-title">{t('admin.dashboard_title')}</h1>
            </div>

            <div className="admin-nav hide-scrollbar">
                <button onClick={() => setActiveTab('dashboard')} className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}><BarChart2 size={18} /> {t('admin.dashboard')}</button>
                <button onClick={() => setActiveTab('products')} className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}><ShoppingBag size={18} /> {t('admin.products')}</button>
                <button
                    onClick={() => {
                        setActiveTab('orders');
                        dispatch(markOrdersAsRead());
                    }}
                    className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    style={{ position: 'relative' }}
                >
                    <Truck size={18} /> {t('admin.orders')}
                    {unreadOrdersCount > 0 && (
                        <span className="admin-nav-badge">{unreadOrdersCount}</span>
                    )}
                </button>
                <button onClick={() => setActiveTab('hero')} className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}><Package size={18} /> {t('admin.hero_slides')}</button>
                <button onClick={() => setActiveTab('promo')} className={`admin-tab-btn ${activeTab === 'promo' ? 'active' : ''}`}><Star size={18} /> {t('admin.promo_banner')}</button>
                <button onClick={() => setActiveTab('brands')} className={`admin-tab-btn ${activeTab === 'brands' ? 'active' : ''}`}><Package size={18} /> {t('filters.brands')}</button>
                <button onClick={() => setActiveTab('reviews')} className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}><Star size={18} /> {t('product.reviews')}</button>
                <button onClick={() => setActiveTab('messages')} className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`} style={{ position: 'relative' }}>
                    <MessageSquare size={18} /> {t('admin.messages')}
                    {unreadMessagesCount > 0 && (
                        <span className="admin-nav-badge">{unreadMessagesCount}</span>
                    )}
                </button>
                <button onClick={() => setActiveTab('settings')} className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}><Settings size={18} /> {t('profile.settings')}</button>
            </div>

            {activeTab === 'dashboard' && (
                <DashboardStats
                    orders={orders}
                    products={products}
                    onOpenProductModal={handleOpenProductModal}
                />
            )}

            {activeTab === 'products' && (
                <ProductManager
                    products={products}
                    onOpenProductModal={handleOpenProductModal}
                />
            )}

            {activeTab === 'hero' && (
                <div className="admin-section">
                    <h2 className="admin-section-title">{t('admin.hero_slides')}</h2>
                    <div className="admin-hero-grid">
                        {(content.heroSlides || []).map(slide => <HeroSlideEditor key={slide.id} slide={slide} />)}
                    </div>
                </div>
            )}

            {activeTab === 'promo' && (
                <div className="admin-section">
                    <h2 className="admin-section-title">{t('admin.promo_banner')}</h2>
                    <PromoEditor initialData={content.promoBanner} />
                </div>
            )}

            {activeTab === 'brands' && (
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h2 className="admin-section-title">{t('filters.brands')}</h2>
                        <button onClick={() => { const name = prompt(`${t('admin.brand_name')}:`); if (name) dispatch(addBrand({ name, count: '0', gradient: 'linear-gradient(135deg, #666 0%, #333 100%)', logo: '' })) }} className="btn-primary" style={{ padding: '10px 20px' }}><Plus size={20} /> {t('common.add')}</button>
                    </div>
                    <div className="admin-brands-grid">
                        {(content.brands || []).map(brand => <BrandEditor key={brand.name} brand={brand} />)}
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && <ReviewManager reviews={reviews} products={products} />}

            {activeTab === 'messages' && (
                <MessageManager
                    messages={messages}
                    unreadMessagesCount={unreadMessagesCount}
                />
            )}

            {activeTab === 'orders' && <OrderManager orders={orders} />}

            {activeTab === 'settings' && (
                <SettingsManager
                    products={products}
                    content={content}
                    reviews={reviews}
                    orders={orders}
                />
            )}

            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                editingProduct={editingProduct}
            />
        </div>
    );
};

export default Admin;