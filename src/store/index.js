import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

import cartReducer from './slices/cartSlice';
import themeReducer from './slices/themeSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import reviewReducer from './slices/reviewSlice';
import wishlistReducer from './slices/wishlistSlice';
import ordersReducer from './slices/ordersSlice';
import messageReducer from './slices/messageSlice';
import uiReducer from './slices/uiSlice';

// Configuration for persist
const persistConfig = {
    key: 'root_v5', // Force clean slate for user
    storage,
    whitelist: ['auth', 'cart', 'reviews', 'wishlist', 'orders', 'messages', 'products'] // Added 'products' to persist stock changes
};

const rootReducer = combineReducers({
    cart: cartReducer,
    theme: themeReducer,
    products: productReducer,
    auth: authReducer,
    content: contentReducer,
    reviews: reviewReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    messages: messageReducer,
    ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
