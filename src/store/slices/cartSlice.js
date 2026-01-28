import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {

            const product = action.payload.product || action.payload;
            const size = action.payload.size || (product.sizes && product.sizes[0]?.size) || 40;

            if (!product || !product.id) return;

            const existingItem = state.items.find((item) => item.id === product.id && item.size === size);

            state.totalQuantity++;
            state.totalAmount += Number(product.price);

            if (!existingItem) {
                state.items.push({
                    id: product.id,
                    size: size,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    quantity: 1,
                    totalPrice: Number(product.price),
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += Number(product.price);
            }
        },
        removeFromCart(state, action) {
            const { id, size } = action.payload;
            const existingItem = state.items.find((item) => item.id === id && item.size === size);

            if (existingItem) {
                state.totalQuantity--;
                state.totalAmount -= Number(existingItem.price);

                if (existingItem.quantity === 1) {
                    state.items = state.items.filter((item) => !(item.id === id && item.size === size));
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice -= Number(existingItem.price);
                }
            }
        },
        removeItemCompletely(state, action) {
            const { id, size } = action.payload;
            const existingItem = state.items.find((item) => item.id === id && item.size === size);
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.items = state.items.filter((item) => !(item.id === id && item.size === size));
            }
        },
        updateQuantity: (state, action) => {
            const { id, size, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id && item.size === size);
            if (existingItem && quantity > 0) {
                const quantityDiff = quantity - existingItem.quantity;
                existingItem.quantity = quantity;
                existingItem.totalPrice = existingItem.price * quantity;
                state.totalQuantity += quantityDiff;
                state.totalAmount += quantityDiff * existingItem.price;
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart, removeItemCompletely, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
