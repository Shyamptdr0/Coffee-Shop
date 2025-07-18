import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

// const BASE_URL = 'http://192.168.138.168:5000';

export const fetchCoffeeData = createAsyncThunk(
    '/data/coffee',
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/data`);
            return res.data; // <- only if backend sends { data: [...] }
        } catch (err) {
            console.log("FETCH ERROR", err.message);
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


const coffeeSlice = createSlice({
    name: 'coffee',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoffeeData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoffeeData.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchCoffeeData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
})

export default coffeeSlice.reducer;