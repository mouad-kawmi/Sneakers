import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        items: [],
        unreadCount: 0
    },
    reducers: {
        addMessage: (state, action) => {
            state.items.push({
                ...action.payload,
                id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                date: new Date().toLocaleString(),
                isRead: false
            });
            state.unreadCount += 1;
        },
        deleteMessage: (state, action) => {
            const message = state.items.find(m => m.id === action.payload);
            if (message && !message.isRead) {
                state.unreadCount -= 1;
            }
            state.items = state.items.filter(m => m.id !== action.payload);
        },
        markAsRead: (state, action) => {
            const message = state.items.find(m => m.id === action.payload);
            if (message && !message.isRead) {
                message.isRead = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach(m => m.isRead = true);
            state.unreadCount = 0;
        },
        initializeDemoMessages: (state) => {
            if (state.items.length === 0) {
                state.items = [{
                    id: 'MSG-DEMO-01',
                    name: 'Système Sberdila',
                    email: 'support@sberdila.com',
                    subject: 'Vérification du Dashboard',
                    message: 'Le Dashboard est prêt. Si vous voyez ce message, le système de messagerie est opérationnel !',
                    date: new Date().toLocaleString(),
                    isRead: false
                }];
                state.unreadCount = 1;
            }
        }
    }
});

export const { addMessage, deleteMessage, markAsRead, markAllAsRead, initializeDemoMessages } = messageSlice.actions;
export default messageSlice.reducer;
