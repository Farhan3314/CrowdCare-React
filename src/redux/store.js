import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../API/BaseApi";
import authReducer from "./features/authSlice";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
