import { createSlice } from '@reduxjs/toolkit';
import { mockProducts } from '../../data/Product';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: mockProducts,
        filters: {
            brand: 'All',
            category: 'All',
            search: '',
            minPrice: 0,
            maxPrice: 10000,
            sizes: []
        },
        sorting: 'newest'
    },
    reducers: {
        setProducts(state, action) {
            state.items = action.payload;
        },
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters(state) {
            state.filters = {
                brand: 'All',
                category: 'All',
                search: '',
                minPrice: 0,
                maxPrice: 10000,
                sizes: []
            };
            state.sorting = 'newest';
        },
        setSorting(state, action) {
            state.sorting = action.payload;
        },
        addProduct(state, action) {
            state.items.unshift({
                id: Date.now(),
                ...action.payload
            });
        },
        deleteProduct(state, action) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateProduct(state, action) {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        reduceStock(state, action) {
            action.payload.forEach(orderItem => {
                const product = state.items.find(p => p.id === orderItem.id);
                if (product && product.sizes) {
                    const sizeObj = product.sizes.find(s => s.size == orderItem.size);
                    if (sizeObj) {
                        sizeObj.stock = Math.max(0, sizeObj.stock - orderItem.quantity);
                    }
                }
            });
        },
        restoreStock(state, action) {
            action.payload.forEach(orderItem => {
                const product = state.items.find(p => p.id === orderItem.id);
                if (product && product.sizes) {
                    const sizeObj = product.sizes.find(s => s.size == orderItem.size);
                    if (sizeObj) {
                        sizeObj.stock += orderItem.quantity;
                    }
                }
            });
        }
    },
});

export const { setProducts, setFilters, clearFilters, addProduct, deleteProduct, updateProduct, reduceStock, restoreStock, setSorting } = productSlice.actions;
export default productSlice.reducer;