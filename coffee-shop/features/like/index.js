import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;


// const BASE_URL = "http://192.168.138.168:5000";

// Initial State
const initialState = {
    favourites: [],
    loading: false,
    error: null,
};

// ✅ Thunk: Add to Favourite
export const addToFav = createAsyncThunk(
    "like/addToFav",
    async ({ userId, productId, favourite }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/like/add`, {
                userId,
                productId,
                favourite,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Add to fav failed" });
        }
    }
);

// ✅ Thunk: Remove from Favourite
export const removeFromFav = createAsyncThunk(
    "like/removeFromFav",
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/like/remove`, {
                data: { userId, productId },
            });
            return productId; // Just return productId to remove from local state
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Remove fav failed" });
        }
    }
);

// ✅ Thunk: Get All Favourites for a User
export const getFavourites = createAsyncThunk(
    "like/getFavourites",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/like/get/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Fetch favs failed" });
        }
    }
);

// ✅ Like Slice
const likeSlice = createSlice({
    name: "like",
    initialState,
    reducers: {
        resetFavourites: (state) => {
            state.favourites = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Add to Fav
        builder
            .addCase(addToFav.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToFav.fulfilled, (state, action) => {
                const exists = state.favourites.find(
                    (item) => item.productId === action.payload.productId
                );
                if (!exists) {
                    state.favourites.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(addToFav.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add favourite";
            });

        // Remove from Fav
        builder
            .addCase(removeFromFav.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromFav.fulfilled, (state, action) => {
                state.favourites = state.favourites.filter(
                    (item) => item.productId !== action.payload
                );
                state.loading = false;
            })
            .addCase(removeFromFav.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove favourite";
            });

        // Get Favourites
        builder
            .addCase(getFavourites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFavourites.fulfilled, (state, action) => {
                state.favourites = action.payload;
                state.loading = false;
            })
            .addCase(getFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch favourites";
            });
    },
});

export const { resetFavourites } = likeSlice.actions;
export default likeSlice.reducer;
