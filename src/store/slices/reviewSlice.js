import { createSlice } from '@reduxjs/toolkit';

import { mockReviews } from '../../data/Product';

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: mockReviews
    },
    reducers: {
        addReview: (state, action) => {
            state.items.push({
                ...action.payload,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                isFeatured: false
            });
        },
        deleteReview: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        toggleFeatured: (state, action) => {
            const review = state.items.find(item => item.id === action.payload);
            if (review) {
                review.isFeatured = !review.isFeatured;
            }
        },
        setReviews(state, action) {
            state.items = action.payload;
        }
    }
});

export const { addReview, deleteReview, toggleFeatured, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
