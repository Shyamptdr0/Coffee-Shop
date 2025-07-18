import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import coffeeSlice from "../features/coffee/coffeeSlice"
import beansSlice from "../features/beans/beansSlice";
import cartSlice from "../features/cart/index";
import likeSlice from "../features/like/index";
import orderSlice from "../features/order/index";

const store = configureStore({
    reducer: {
        auth: authReducer,
        coffeeData: coffeeSlice,
        beansData: beansSlice,
        cartData: cartSlice,
        like: likeSlice,
        order : orderSlice,
    },
});

export default store;
