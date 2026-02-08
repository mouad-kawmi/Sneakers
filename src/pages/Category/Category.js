import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../store/slices/productSlice';
import BrandCategories from '../../components/BrandCategories/BrandCategories';
import AllProducts from '../../components/products/AllProducts/AllProducts';
import { motion } from 'framer-motion';
import SEO from '../../components/layout/SEO/SEO';
import './Category.css';

const Category = () => {
    const { t } = useTranslation();
    const { name } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const categories = ['Men', 'Women', 'Kids', 'All'];
        const isCategory = categories.includes(name);

        if (isCategory) {
            dispatch(setFilters({ category: name, brand: 'All' }));
        } else {
            dispatch(setFilters({ category: 'All', brand: name }));
        }
        window.scrollTo(0, 0);
    }, [name, dispatch]);

    const categories = ['Men', 'Women', 'Kids', 'All'];
    const isCategoryPage = categories.includes(name);

    const getDisplayName = () => {
        const categoryKey = name.toLowerCase();
        return t(`category.${categoryKey}`);
    };

    return (
        <div className="category-page">
            <SEO
                title={getDisplayName()}
                description={t('category.seo_description', { name: getDisplayName().toLowerCase() })}
            />
            <div className="container category-header">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="category-header-top">
                        <div className="category-header-line" />
                        <span className="category-header-badge">
                            {t('category.exclusive_collection')}
                        </span>
                    </div>
                    <h1 className="category-title">
                        {getDisplayName()}
                    </h1>
                    <p className="category-description">
                        {t('category.description', { name: getDisplayName().toLowerCase() })}
                    </p>
                </motion.div>
            </div>

            <BrandCategories category={isCategoryPage ? name : 'All'} />

            <div className="category-products-wrapper">
                <AllProducts />
            </div>
        </div>
    );
};

export default Category;
