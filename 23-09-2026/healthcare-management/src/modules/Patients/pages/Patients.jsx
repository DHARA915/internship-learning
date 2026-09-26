import React, { useState, useRef } from "react";
import DataTable from "@/components/DataTable";
import { patientColumns } from "../data";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/components/sidebar/config";
import Modal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, updatePatient, deletePatient } from "@/Redux/Slices/PatientSlice";
import AlertDialogbox from "@/components/AlertDialogbox";


const Patients = () => {
  const location = useLocation();

  const [activeForm, setActiveForm] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const patientToDelete = useRef()

  const dispatch = useDispatch()

  const currentPage = NAV_ITEMS.find(
    (item) => item.to === location.pathname
  );

  const patients = useSelector((state) => state.patients.patients)

  const patientFields = patientColumns.map((column) => ({
    name: column.key,
    label: column.label,
    type: column.type,
    required: column.required,
  }));

  const handleSubmit = (data) => {
    if (selectedPatient) {
      // EDIT
      dispatch(
        updatePatient({
          id: selectedPatient.id,
          data: data,
        })
      );
    } else {
      // ADD
      dispatch(
        addPatient({
          id: Date.now(),
          ...data,
        })
      );
    }

    setSelectedPatient(null);
    setActiveForm(null);
  };

  const handleEdit = (patient) => {
    console.log("Patient selected for edit:", patient);

    setSelectedPatient(patient);
    setActiveForm("edit");
  };

  const handleDelete = (patient) => {
    console.log("Delete Id:", patient)
    patientToDelete.current = patient;
    setDeleteDialogOpen(true)

    // dispatch(deletePatient(patient.id));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Add Button */}
      <div className="flex justify-end px-6 py-4">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedPatient(null);
            setActiveForm("add");
          }}
        >
          {currentPage.actionLabel}
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={patientColumns}
        data={patients}
        onRowDoubleClick={handleEdit}
        onDelete={handleDelete}

      />

      {/* Modal */}
      {/* <Modal
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
      /> */}

      <Modal
        open={
          activeForm === "add" ||
          activeForm === "edit"
        }
        onOpenChange={(open) => {
          if (!open) {
            setActiveForm(null);
            setSelectedPatient(null);
          }
        }}
        title={
          activeForm === "edit"
            ? "Edit Patient"
            : "Add Patient"
        }
        description={
          activeForm === "edit"
            ? "Update the patient's information below."
            : "Enter the patient's information below."
        }
        fields={patientFields}
        initialData={selectedPatient || {}}
        onSubmit={handleSubmit}
        submitLabel={
          activeForm === "edit"
            ? "Update"
            : "Save"
        }
      />

      <AlertDialogbox
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Patient?"
        description={`Are you sure you want to delete ${patientToDelete.current?.name
          }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          dispatch(deletePatient(patientToDelete.current.id));

          setDeleteDialogOpen(false);
          patientToDelete.current = null;
        }}
      />

    </div>
  );
};

export default Patients;