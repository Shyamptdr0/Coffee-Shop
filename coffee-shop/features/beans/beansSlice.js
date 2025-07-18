import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;


// const BASE_URL = 'http://192.168.138.168:5000';

export const fetchBeansData = createAsyncThunk(
    '/beans/beans',
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/beans`);
            return res.data; // <- only if backend sends { data: [...] }
        } catch (err) {
            console.log("FETCH ERROR", err.message);
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


const beansSlice = createSlice({
    name: 'beans',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBeansData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBeansData.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchBeansData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
})

export default beansSlice.reducer;