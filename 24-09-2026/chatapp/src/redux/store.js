import { configureStore } from "@reduxjs/toolkit";
import chatReducer from './Slices/chatSlice';
import messageReducer from './Slices/messageSlice'

export const store = configureStore({
    reducer:{
        chat:chatReducer,
        message:messageReducer
    }
})