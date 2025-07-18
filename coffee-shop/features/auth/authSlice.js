import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,

}
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

// const BASE_URL = 'http://192.168.138.168:5000'; // Replace with your backend URL


export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
            withCredentials: true
        })
        return response.data;
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async (formData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
                withCredentials: true,
            });

            if (response.data?.token) {
                await AsyncStorage.setItem("token", response.data.token);
            }

            return response.data;
        } catch (error) {
            await AsyncStorage.removeItem("token");
            return rejectWithValue(error.response?.data || {success: false});
        }
    }
);


export const logoutUser = createAsyncThunk('/auth/logout',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            await AsyncStorage.removeItem("token");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || {success: false});
        }
    }
);


// export const checkAuth = createAsyncThunk('/auth/checkauth',
//     async()=>{
//         const response =   await axios.get(`${BASE_URL}/api/auth/check-auth`,
//             {
//                 withCredentials : true,
//                 headers :{
//                     'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
//                     Expires: '0'
//                 }
//             }
//            )
//         return response.data;
//     }
// )

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async (_, {rejectWithValue}) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error("Token not found");

            const response = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Expires: '0'
                }
            });

            return response.data;
        } catch (error) {
            await AsyncStorage.removeItem("token");
            return rejectWithValue(error.response?.data || {success: false});
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
        },
        resetTokenAndCrendentails: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null
                state.isAuthenticated = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload.success) {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.token = action.payload.token;
                    AsyncStorage.setItem('token', JSON.stringify(action.payload.token));
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
                AsyncStorage.removeItem('token');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                AsyncStorage.removeItem('token');
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null
                state.isAuthenticated = false
            })
    }
})

export const {setUser, resetTokenAndCrendentails} = authSlice.actions;
export default authSlice.reducer