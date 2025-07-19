import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
};

// ========== REGISTER ==========
export const registerUser = createAsyncThunk(
    '/auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { success: false });
        }
    }
);

// ========== LOGIN ==========
export const loginUser = createAsyncThunk(
    '/auth/login',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
                withCredentials: true,
            });

            if (response.data?.token) {
                await AsyncStorage.setItem("token", response.data.token);
                await AsyncStorage.setItem("user", JSON.stringify(response.data.user)); // 👈 Add this line
            }


            return response.data;
        } catch (error) {
            await AsyncStorage.removeItem("token");
            return rejectWithValue(error.response?.data || { success: false });
        }
    }
);

// ========== LOGOUT ==========
export const logoutUser = createAsyncThunk(
    '/auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true,
            });
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { success: false });
        }
    }
);

// ========== CHECK AUTH ==========
export const checkAuth = createAsyncThunk(
    '/auth/checkauth',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');

            if (!token || !user) throw new Error("Token or user not found");

            // Optional: validate token with API
            const response = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.data.success) throw new Error("Token expired");

            return {
                success: true,
                user: JSON.parse(user),
                token
            };

        } catch (error) {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            return rejectWithValue(error.response?.data || { success: false });
        }
    }
);


// ========== SLICE ==========
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = !!action.payload.token;
        },
        resetTokenAndCrendentails: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload.success) {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.token = action.payload.token;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.token = null;
                }
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            })

            // CHECK AUTH
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.isLoading = false;
            });
    },
});

export const { setUser, resetTokenAndCrendentails } = authSlice.actions;
export default authSlice.reducer;
