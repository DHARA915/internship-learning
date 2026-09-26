import { createSlice } from "@reduxjs/toolkit";
import { patients } from "@/modules/Patients/data";

const initialState = {
    patients: patients,
}

const patientSlice = createSlice({
    name: "patients",
    initialState,

    reducers: {

        addPatient: (state, action) => {
            state.patients.push(action.payload)
        },

        // updatePatient:(state,action)=>{
        //       const { id, data } = action.payload;

        //     const patient= state.patients.find((patient)=>patient.id===id);

        //     if(patient){
        //         Object.assign(patient,data)
        //     }
        // },

        updatePatient: (state, action) => {
            const { id, data } = action.payload;

            const index = state.patients.findIndex(
                (patient) => String(patient.id) === String(id)
            );

            console.log("Updating patient:");
            console.log("ID:", id);
            console.log("Index:", index);
            console.log("New data:", data);

            if (index !== -1) {
                state.patients[index] = {
                    ...state.patients[index],
                    ...data,
                };
            }
        },

        deletePatient: (state, action) => {
            state.patients = state.patients.filter((patient) => String(patient.id) !== String(action.payload))
        }
    }

})

export const {
    addPatient, updatePatient, deletePatient,
} = patientSlice.actions;

export default patientSlice.reducer