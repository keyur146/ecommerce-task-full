import {configureStore} from "@reduxjs/toolkit";
import authService from "./services/authService";
import categoryService from "./services/categoryService";
import authReducer from "./reducers/authReducer";
import { setupListeners } from '@reduxjs/toolkit/query'
import productService from "./services/productService";
import globalReducer from "./reducers/globalReducer";
import homeProducts from "./services/homeProducts";
import cartReducer from "./reducers/cartReducer";
import paymentService from "./services/paymentService";
import orderService from "./services/orderService";
import userOrdersService from "./services/userOrdersService";

const Store = configureStore({
    reducer:{
         [authService.reducerPath]: authService.reducer,
         [categoryService.reducerPath]: categoryService.reducer,
         [productService.reducerPath]: productService.reducer,
         [homeProducts.reducerPath]: homeProducts.reducer,
         [paymentService.reducerPath]: paymentService.reducer,
         [orderService.reducerPath]: orderService.reducer,
         [userOrdersService.reducerPath]: userOrdersService.reducer,
         "authReducer": authReducer,
         "globalReducer": globalReducer,
         cartReducer,
    },

// Adding the api middleware enables caching, invalidation, polling,
// and other useful features of `rtk-query`.

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authService.middleware, categoryService.middleware,
     productService.middleware, homeProducts.middleware, paymentService.middleware, 
     orderService.middleware, userOrdersService.middleware),
})

setupListeners(Store.dispatch);
export default Store;