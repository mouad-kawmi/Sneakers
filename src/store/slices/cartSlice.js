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

            // Use originalPrice if available (to prevent double discounting), otherwise use price
            const basePrice = product.originalPrice || product.price;

            // Calculate final price with discount if applicable and not expired
            const hasDiscount = product.discount > 0 && (!product.discountEndTime || new Date(product.discountEndTime) > new Date());
            const finalPrice = hasDiscount ? Math.floor(basePrice * (1 - product.discount / 100)) : basePrice;

            const existingItem = state.items.find((item) => item.id === product.id && item.size === size);

            state.totalQuantity++;
            state.totalAmount += Number(finalPrice);

            if (!existingItem) {
                state.items.push({
                    id: product.id,
                    size: size,
                    name: product.name,
                    price: Number(finalPrice),
                    originalPrice: Number(basePrice),
                    discount: hasDiscount ? product.discount : 0,
                    image: product.image,
                    quantity: 1,
                    totalPrice: Number(finalPrice),
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += Number(finalPrice);
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
