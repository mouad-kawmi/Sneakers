import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../../store/slices/productSlice';
import AllProducts from '../../components/products/AllProducts/AllProducts';
import SEO from '../../components/layout/SEO/SEO';
import './Search.css';

const SearchPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilters({ search: query }));
    }, [query, dispatch]);

    return (
        <div className="search-page">
            <SEO title={query ? t('search_page.title', { query }) : t('search_page.all_collection')} />
            <div className="container">
                <div className="search-results-header">
                    <div className="results-count">
                        <strong>{query ? t('search_page.title', { query }) : t('search_page.all_collection')}</strong>
                    </div>
                </div>
                <div className="search-products-wrapper">
                    <AllProducts />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
