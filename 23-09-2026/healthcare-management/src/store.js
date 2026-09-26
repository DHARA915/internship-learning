// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import patientReducer from './Redux/Slices/PatientSlice'

export const store = configureStore({
    reducer:{
        patients:patientReducer
    }
});

