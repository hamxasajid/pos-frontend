import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import categoryReducer from './categorySlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        users: userReducer,
        categories: categoryReducer,
        dashboard: dashboardReducer,
    },
});
