import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isCartOpen: false,
        isLoginModalOpen: false,
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
        },
        openLoginModal(state) {
            state.isLoginModalOpen = true;
        },
        closeLoginModal(state) {
            state.isLoginModalOpen = false;
        }
    }
});

export const { openCart, closeCart, toggleCart, openLoginModal, closeLoginModal } = uiSlice.actions;
export default uiSlice.reducer;
