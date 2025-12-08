import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const addUser = createAsyncThunk(
    'users/add',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users', userData);
            toast.success('User added');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/update',
    async (userData, { rejectWithValue }) => {
        try {
            const { id, ...rest } = userData;
            const { data } = await api.put(`/users/${id}`, rest);
            toast.success('User updated');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            });
    },
});

export default userSlice.reducer;
