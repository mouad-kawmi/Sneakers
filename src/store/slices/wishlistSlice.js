import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: []
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const index = state.items.findIndex(item => item.id === product.id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(product);
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    }
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
