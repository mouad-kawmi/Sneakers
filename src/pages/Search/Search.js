import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setFilters } from '../../store/slices/productSlice';
import AllProducts from '../../components/products/AllProducts/AllProducts';
import SEO from '../../components/layout/SEO/SEO';
import './Search.css';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFilters({ search: query }));
    }, [query, dispatch]);

    return (
        <div className="search-page">
            <SEO title={query ? `Recherche: ${query}` : 'Toute la collection'} />
            <div className="container">
                <div className="search-results-header">
                    <div className="results-count">
                        <strong>{query ? `"${query}"` : 'Toute la collection'}</strong>
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
