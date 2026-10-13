import { configureStore } from "@reduxjs/toolkit";
import eventReducer from '../Redux/Slices/eventslice'
import registrationReducer from '../Redux/Slices/Registrationsslice '

export const store = configureStore({
  reducer: {
    events:eventReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;