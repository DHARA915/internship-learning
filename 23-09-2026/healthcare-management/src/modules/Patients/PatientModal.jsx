import React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/Modal";

const PatientModal = ({ open, onOpenChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add patient logic
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Patient"
      description="Enter patient information."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="patient-form">
            Add Patient
          </Button>
        </>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" />
          </Field>

          <Field>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" />
          </Field>

          <Field>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" />
          </Field>

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </Field>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default PatientModal;