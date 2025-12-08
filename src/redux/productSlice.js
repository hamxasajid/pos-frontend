import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/products');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/products', productData);
            toast.success('Product added successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async (productData, { rejectWithValue }) => {
        try {
            const { id, ...rest } = productData;
            const { data } = await api.put(`/products/${id}`, rest);
            toast.success('Product updated successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload);
            });
    },
});

export default productSlice.reducer;
