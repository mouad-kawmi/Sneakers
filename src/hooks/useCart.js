import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart, updateQuantity } from '../store/slices/cartSlice';
import { toggleCart } from '../store/slices/uiSlice';

const useCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const isCartOpen = useSelector((state) => state.ui.isCartOpen);
    const { items, totalQuantity, totalAmount: totalPrice } = cart;

    const addItem = (product) => {
        dispatch(addToCart(product));
    };

    const removeItem = (id, size) => {
        dispatch(removeFromCart({ id, size }));
    };

    const updateItemQuantity = (id, size, quantity) => {
        dispatch(updateQuantity({ id, size, quantity }));
    };

    const clear = () => {
        dispatch(clearCart());
    };

    const toggle = () => {
        dispatch(toggleCart());
    };

    return {
        cart,
        items,
        totalQuantity,
        totalPrice,
        isOpen: isCartOpen,
        addItem,
        removeItem,
        updateItemQuantity,
        clear,
        toggle
    };
};

export default useCart;
