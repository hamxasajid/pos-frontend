import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/categories');
            return data; // [{ id, name }, ...]
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const addCategory = createAsyncThunk(
    'categories/add',
    async (name, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/categories', { name });
            toast.success('Category added');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            // id could be _id or name if backend handles it
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    categories: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload && c.name !== action.payload);
            });
    },
});

export default categorySlice.reducer;
