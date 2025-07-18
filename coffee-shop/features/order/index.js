import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;
// console.log("BASE_URL:", BASE_URL);

// const BASE_URL= "http://192.168.138.168:5000"


const initialState = {
    orderItems: [],
    loading: false,
    error: null,
    successMessage: null
};


export const createOrder = createAsyncThunk(
    "order/create",
    async ({userId}, {rejectWithValue}) =>{
        try{
            const response = await axios.post(`${BASE_URL}/api/order/create`, {userId})
             return  response.data;
        }
        catch (error){
            return rejectWithValue(error.response?.data || {message: "order create failed"});
        }
    }
)

export const getUserOrders = createAsyncThunk(
    "order/getUserOrders",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/order/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
        }
    }
);



const OrderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // createOrder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderItems.push(action.payload.order);
                state.successMessage = action.payload.message;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Order creation failed";
            })

            // getUserOrders
            .addCase(getUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orderItems = action.payload;
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch orders";
            });
    }

});

export default OrderSlice.reducer;