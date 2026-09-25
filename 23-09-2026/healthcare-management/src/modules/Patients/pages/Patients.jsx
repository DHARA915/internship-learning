// import React from 'react'
// import DataTable from '@/components/DataTable'
// import { patientColumns , patients } from '../data'
// import Button from '@/components/Button'
// import { useLocation } from 'react-router-dom'
// import { useState } from 'react'
// import { NAV_ITEMS } from '@/components/sidebar/config'
// import Modal from '@/components/Modal'

// const Patients = () => {

//   const location = useLocation();
//   const [activeForm, setAvtiveForm] = useState(null);
//   const currentPage = NAV_ITEMS.find((item) => item.to === location.pathname);

//   const patientFields = patientColumns.map((column)=>({
//     name:column.key,
//     label:column.label,
//     type:column.type,
//     required: column.required,
//   }))


//   const  handleSubmit = (data)=>{
//     console.log("Patient data:", data)
//   }

//   console.log("Active Form:" , activeForm)

//   return (
//      <div className="flex h-full min-h-0 flex-col">
//       <div className="flex justify-end px-6 py-4">
//             <Button variant="primary" onClick={() => setAvtiveForm(currentPage.to)}>
//               {currentPage.actionLabel}
//             </Button>
//       </div>

      

//         <DataTable
//           columns={patientColumns}
//           data={patients}         
//         />

//         <Modal
//         open={activeForm === currentPage.to}
//         onOpenChange = {(opne)=>{
//           if(!open) setAvtiveForm(null)
//         }}
//        title="Add Patient"
//         description="Enter the patient's information below."
//         fields={patientFields}
//         onSubmit={handleSubmit}
//         />

//       </div>
//   )
// }

// export default Patients

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import { patientColumns, patients } from "../data";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/components/sidebar/config";
import Modal from "@/components/Modal";

const Patients = () => {
  const location = useLocation();

  const [activeForm, setActiveForm] = useState(null);

  const currentPage = NAV_ITEMS.find(
    (item) => item.to === location.pathname
  );

  const patientFields = patientColumns.map((column) => ({
    name: column.key,
    label: column.label,
    type: column.type,
    required: column.required,
  }));

  const handleSubmit = (data) => {
    console.log("Patient data:", data);

    // Close modal after submit
    setActiveForm(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Add Button */}
      <div className="flex justify-end px-6 py-4">
        <Button
          variant="primary"
          onClick={() => setActiveForm(currentPage.to)}
        >
          {currentPage.actionLabel}
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={patientColumns}
        data={patients}
      />

      {/* Modal */}
      <Modal
        open={activeForm === currentPage.to}
        onOpenChange={(open) => {
          if (!open) {
            setActiveForm(null);
          }
        }}
        title="Add Patient"
        description="Enter the patient's information below."
        fields={patientFields}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default Patients;