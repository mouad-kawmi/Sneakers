import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const loginUser = (userData) => {
        // Since the slice is synchronous, we just dispatch login directly.
        // In a real app with API, you'd have async logic here or in a thunk.
        dispatch(login({ user: userData }));
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    const isAdmin = isAuthenticated && user?.role === 'admin';

    // Returning loading/error as false/null since the current slice doesn't track them
    return {
        user,
        isAuthenticated,
        isAdmin,
        loading: false,
        error: null,
        login: loginUser,
        logout: logoutUser
    };
};

export default useAuth;
