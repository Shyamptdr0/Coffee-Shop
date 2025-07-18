import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;


// const BASE_URL = "http://192.168.138.168:5000";

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null,
};

// ✅ Add to Cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, name, type, image, size, price, quantity }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(
                `${BASE_URL}/api/cart/add`,
                { userId, productId, name, type, image, size, price, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Add to cart failed" });
        }
    }
);

// ✅ Get Cart
export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/api/cart/get/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Fetch cart failed" });
        }
    }
);

// ✅ Update Quantity
export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, size, quantity }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.put(`${BASE_URL}/api/cart/update`,
                { userId, productId, size, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Update quantity failed" });
        }
    }
);

// ✅ Delete Cart Item
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userId, productId, size }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.delete(
                `${BASE_URL}/api/cart/remove/${userId}?productId=${productId}&size=${size}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Delete item failed" });
        }
    }
);


// ✅ Clear Cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async ({ userId }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.delete(`${BASE_URL}/api/cart/clear/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Clear cart failed" });
        }
    }
);


const shopCartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.items;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Add to cart failed";
            })

            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.items;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Fetch cart failed";
            })

            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.items;
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Update quantity failed";
            })

            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.items;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Delete item failed";
            })

            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Clear cart failed";
            });
    },
});

export default shopCartSlice.reducer;
