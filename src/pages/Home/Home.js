import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearFilters } from '../../store/slices/productSlice';
import HeroSection from '../../components/HeroSection/HeroSection';
import BrandCategories from '../../components/BrandCategories/BrandCategories';
import PromoBanner from '../../components/PromoBanner/PromoBanner';
import Testimonials from '../../components/Testimonials/Testimonials';
import NewArrivals from '../../components/products/NewArrivals/NewArrivals';
import AllProducts from '../../components/products/AllProducts/AllProducts';
import ProductSpotlight from '../../components/ProductSpotlight/ProductSpotlight';
import RevealOnScroll from '../../components/RevealOnScroll/RevealOnScroll';
import SEO from '../../components/layout/SEO/SEO';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    return (
        <div className="home-page">
            <SEO title="Accueil - Meilleure Boutique de Sneakers au Maroc" />
            <RevealOnScroll>
                <HeroSection />
            </RevealOnScroll>

            <div className="home-spacer"></div>

            <div className="container home-new-arrivals-container">
                <NewArrivals />
            </div>

            <RevealOnScroll direction="right">
                <ProductSpotlight />
            </RevealOnScroll>

            <RevealOnScroll>
                <BrandCategories />
            </RevealOnScroll>

            <div className="home-all-products-container">
                <AllProducts />
            </div>

            <RevealOnScroll direction="left">
                <PromoBanner />
            </RevealOnScroll>

            <RevealOnScroll>
                <Testimonials />
            </RevealOnScroll>
            <div className="home-bottom-spacer"></div>
        </div>
    );
};

export default Home;
