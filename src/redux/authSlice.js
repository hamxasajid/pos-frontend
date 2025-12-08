import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import toast from 'react-hot-toast';

const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const initialState = {
    user: savedUser,
    isAuthenticated: !!savedUser,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                toast.success(`Welcome back, ${action.payload.name}!`);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
