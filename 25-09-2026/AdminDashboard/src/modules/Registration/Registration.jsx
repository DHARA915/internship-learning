import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { steps } from "./components/stepconfig";
import { Button } from "@/components/ui/button";

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastName: "",
      email: "",
      phone: "",

      address: "",
      city: "",
      state: "",
      pincode: "",

      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    trigger,
    handleSubmit,
  } = form;

  const nextStep = async () => {
    // Validate only fields of current step
     const fieldNames = steps[currentStep].fields.map(
    (field) => field.name
  );
    const isValid = await trigger(fieldNames);

    if (!isValid) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    console.log("Registered Data:", data);
  };

  const currentStepData = steps[currentStep];
  const CurrentStep = currentStepData.component;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-background shadow-sm">

        {/* Header */}
        <div className="border-b border-border bg-secondary p-6">
          <h1 className="text-2xl font-bold text-tertiary">
            Registration
          </h1>

          <p className="mt-1 text-sm text-secondary">
            Please enter your registration details.
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Current Step */}
            <div className="min-h-[350px] p-6">

              <h2 className="mb-6 text-xl font-semibold text-tertiary">
                {steps[currentStep].title}
              </h2>

              <CurrentStep fields={currentStepData.fields} />

            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-border p-6">

              {/* Previous */}
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
              >
                Previous
              </Button>

              {/* Next */}
              {!isLastStep && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-primary hover:opacity-90"
                >
                  Next
                </Button>
              )}

              {/* Register */}
              {isLastStep && (
                <Button
                  type="submit"
                  className="bg-primary text-primary hover:opacity-90"
                >
                  Register
                </Button>
              )}

            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Registration;