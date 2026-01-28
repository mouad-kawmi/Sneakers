import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    users: [
        {
            name: 'Admin',
            email: 'admin',
            password: 'admin',
            role: 'admin',
            addresses: []
        },
        {
            name: 'Test Admin',
            email: 'admin@example.com',
            password: 'admin',
            role: 'admin',
            addresses: []
        },
        {
            name: 'Test User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            addresses: []
        }
    ]
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        register: (state, action) => {
            const newUser = { ...action.payload, role: 'user', addresses: [] };
            state.users.push(newUser);
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        updateUserProfile: (state, action) => {
            const { name, email } = action.payload;
            if (state.user) {

                const userIndex = state.users.findIndex(u => u.email === state.user.email);
                if (userIndex !== -1) {
                    state.users[userIndex].name = name;
                    state.users[userIndex].email = email;
                }

                state.user.name = name;
                state.user.email = email;
            }
        },
        updatePassword: (state, action) => {
            const { currentPassword, newPassword } = action.payload;
            if (state.user) {
                const userIndex = state.users.findIndex(u => u.email === state.user.email);
                if (userIndex !== -1 && state.users[userIndex].password === currentPassword) {
                    state.users[userIndex].password = newPassword;
                }
            }
        },
        addAddress: (state, action) => {
            if (state.user) {
                if (!state.user.addresses) state.user.addresses = [];
                const newAddress = { ...action.payload, id: Date.now() };
                state.user.addresses.push(newAddress);

                const userIndex = state.users.findIndex(u => u.email === state.user.email);
                if (userIndex !== -1) {
                    if (!state.users[userIndex].addresses) state.users[userIndex].addresses = [];
                    state.users[userIndex].addresses.push(newAddress);
                }
            }
        },
        updateAddress: (state, action) => {
            const { id, ...addressData } = action.payload;
            if (state.user && state.user.addresses) {
                const addressIndex = state.user.addresses.findIndex(a => a.id === id);
                if (addressIndex !== -1) {
                    state.user.addresses[addressIndex] = { ...state.user.addresses[addressIndex], ...addressData };

                    const userIndex = state.users.findIndex(u => u.email === state.user.email);
                    if (userIndex !== -1 && state.users[userIndex].addresses) {
                        state.users[userIndex].addresses[addressIndex] = state.user.addresses[addressIndex];
                    }
                }
            }
        },
        deleteAddress: (state, action) => {
            const addressId = action.payload;
            if (state.user && state.user.addresses) {
                state.user.addresses = state.user.addresses.filter(a => a.id !== addressId);

                const userIndex = state.users.findIndex(u => u.email === state.user.email);
                if (userIndex !== -1 && state.users[userIndex].addresses) {
                    state.users[userIndex].addresses = state.user.addresses;
                }
            }
        },
        setDefaultAddress: (state, action) => {
            const addressId = action.payload;
            if (state.user && state.user.addresses) {
                state.user.addresses = state.user.addresses.map(a => ({
                    ...a,
                    isDefault: a.id === addressId
                }));

                const userIndex = state.users.findIndex(u => u.email === state.user.email);
                if (userIndex !== -1 && state.users[userIndex].addresses) {
                    state.users[userIndex].addresses = state.user.addresses;
                }
            }
        },
    },
});

export const {
    login,
    logout,
    register,
    updateUserProfile,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = authSlice.actions;
export default authSlice.reducer;
