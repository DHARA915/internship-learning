

import React from "react";
import { useFormContext } from "react-hook-form";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Form = ({ fields }) => {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext();

  const getValidationRules = (field) => {
    const rules = {};

    // Required
    if (field.required) {
      rules.required = `${field.label} is required`;
    }

    // Minimum length
    if (field.minLength) {
      rules.minLength = {
        value: field.minLength,
        message: `${field.label} must be at least ${field.minLength} characters`,
      };
    }

    // Email validation
    if (field.type === "email") {
      rules.pattern = {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      };
      rules.validate = (value) =>
        value.trim() === value || "Email cannot contain spaces";
    }

    // Number validation
    if (field.type === "number") {
      rules.validate = (value) => {
        if (value === "") return true;

        return /^\d+$/.test(value) || `${field.label} must contain only numbers`;
      };
    }

    // Phone validation
    if (field.type === "tel") {
      rules.pattern = {
        value: /^[0-9]{10}$/,
        message: `${field.label} must contain only numbers`,
      };
    }

    //For confirm Password
    if (field.name === "confirmPassword") {
      rules.validate = (value) =>
        value === getValues("password") || "Passwords do not match";
    }

    return rules;
  };

  return (
    <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
      {fields.map((field) => {
        const error = errors[field.name];

        return (
          <Field key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-tertiary">
              {field.label}

              {field.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </Label>

            <Input
              id={field.name}
              type={field.type === "number" ? "text" : field.type}
              inputMode={
                field.type === "number" || field.type === "tel"
                  ? "numeric"
                  : undefined
              }
              placeholder={field.placeholder}
              {...register(field.name, getValidationRules(field))}
              onWheel={(e) => {
                if (field.type === "number") {
                  e.currentTarget.blur();
                }
              }}
              onKeyDown={(e) => {
                if (field.type === "number") {
                  if (
                    ["e", "E", "+", "-", ".", ","].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }
              }}
              className={`
                border-border
                bg-background
                text-tertiary
                placeholder:text-secondary
                focus-visible:ring-[var(--bg-primary)]
                ${error ? "border-red-500" : ""}
              `}
            />

            {error && (
              <p className="text-sm text-red-500">
                {error.message}
              </p>
            )}
          </Field>
        );
      })}
    </FieldGroup>
  );
};

export default Form;