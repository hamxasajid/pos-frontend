import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk(
    'cart/createOrder',
    async (orderData, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post('/orders', orderData);
            toast.success('Order created successfully');
            dispatch(clearCart());
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create order');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    cartItems: [],
    discount: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].quantity += 1;
            } else {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }
            toast.success('Added to cart');
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
            toast.error('Removed from cart');
        },
        incrementQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.id === action.payload);
            if (item) item.quantity += 1;
        },
        decrementQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
            }
        },
        setDiscount: (state, action) => {
            state.discount = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.discount = 0;
            state.loading = false; // Reset loading on clear
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.loading = false;
                // Cart is cleared by dispatching clearCart in thunk or here if we want (but thunk dispatched it)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, setDiscount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
