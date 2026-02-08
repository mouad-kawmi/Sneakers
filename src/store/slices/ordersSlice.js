import { createSlice } from '@reduxjs/toolkit';
import { mockOrders } from '../../data/Product';

const initialState = {
    items: [],
    unreadOrdersCount: 0
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder(state, action) {
            state.items.unshift(action.payload);
            state.unreadOrdersCount += 1;
        },
        markOrdersAsRead(state) {
            state.unreadOrdersCount = 0;
        },
        updateOrderStatus(state, action) {
            const { id, status } = action.payload;
            const order = state.items.find(o => o.id === id);
            if (order) {
                order.status = status;

                if (!order.history) order.history = [];
                order.history.push({
                    status,
                    date: new Date().toISOString()
                });
            }
        },
        initializeDemoOrders(state) {
            if (state.items.length === 0) {
                state.items = mockOrders;
            }
        },
        setOrders(state, action) {
            state.items = action.payload;
        }
    }
});

export const { addOrder, updateOrderStatus, initializeDemoOrders, setOrders, markOrdersAsRead } = ordersSlice.actions;
export default ordersSlice.reducer;
