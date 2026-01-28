export const ROUTES = {
    HOME: '/',
    ADMIN: '/admin',
    CONTACT: '/contact',
    CATEGORY: '/category/:name',
    PRODUCT_DETAILS: '/product/:id',
    PRODUCT_REVIEWS: '/product/:id/reviews',
    HELP: '/help',
    CHECKOUT: '/checkout',
    TRACK_ORDER: '/track-order',
    PROFILE: '/profile',
    WISHLIST: '/wishlist',
    SEARCH: '/search',
    ABOUT: '/about',
    FAQ: '/faq',
    PRIVACY: '/privacy',
    TERMS: '/terms',
};

// Helper for dynamic routes
export const getCategoryPath = (name) => `/category/${name}`;
export const getProductPath = (id) => `/product/${id}`;
export const getProductReviewsPath = (id) => `/product/${id}/reviews`;
