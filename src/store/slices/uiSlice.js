import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isCartOpen: false,
    },
    reducers: {
        openCart(state) {
            state.isCartOpen = true;
        },
        closeCart(state) {
            state.isCartOpen = false;
        },
        toggleCart(state) {
            state.isCartOpen = !state.isCartOpen;
        }
    }
});

export const { openCart, closeCart, toggleCart } = uiSlice.actions;
export default uiSlice.reducer;
