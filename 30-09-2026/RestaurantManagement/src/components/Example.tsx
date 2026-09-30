import { Button } from "@base-ui/react";
import { FormField } from "./form-field/Formfield";
import { useState } from "react";

const Example = () => {
  const countries = [
    { label: "India", value: "in" },
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
  ];

  const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const skills = [
    { label: "React", value: "react" },
    { label: "Node.js", value: "node" },
    { label: "TypeScript", value: "ts" },
    { label: "Next.js", value: "next" },
  ];

  //Typing of a form
  interface Formvalue {
    name: string;
    email: string;
    phone: string;
    password: string;
    age: string;
    website: string;
    bio: string;
    country: string;
    gender: string;
    skills: string[];
    terms: boolean;
  }

  const initialValues: Formvalue = {
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    website: "",
    bio: "",
    country: "",
    gender: "",
    skills: [],
    terms: false,
  };

  const [form, setForm] = useState<Formvalue>(initialValues);
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});

  // errors reported live by the fields themselves (via onValidate)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  // handle change for each field;

  const handleChange = (value: unknown, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the submit error for this field as soon as the user edits it
    setSubmitErrors(({ [name]: _removed, ...rest }) => rest);
  };

  /* ---------- 4. collect validation results from input fields ---------- */
  const handleValidate = (error: string | undefined, name: string) =>
    setFieldErrors((prev) => ({ ...prev, [name]: error }));

  const handleSubmit = () => {
    const error: Record<string, string> = {};
    if (!form.name.trim()) error.name = "name is required";
    if (!form.email.trim()) error.email = "email is required";
    if (!form.phone.trim()) error.phone = "phone is required";
    if (!form.password.trim()) error.password = "password is required";
    if (!form.country) error.country = "country is required";
    if (!form.gender) error.gender = "gender is required";
    if (form.skills.length === 0) error.skills = "Select at least one skill";
    if (!form.terms) error.terms = "You must accept the terms";

    const hasLiveErrors = Object.values(fieldErrors).some(Boolean);
 
    if (Object.keys(error).length > 0 || hasLiveErrors) {
      setSubmitErrors(error);
      return;
    }
 
    const payload = {...form ,age:form.age?Number(form.age):null}; //Convert string age to number
    console.log("Submitted Form:",payload)

    setForm(initialValues)
    setFieldErrors({});
  };

  return (
    <div className="mx-auto grid max-w-md gap-4 p-6">
      {/* type omitted → text input */}
      <FormField
        name="name"
        label="Full name"
        required
        minLength={2}
        value={form.name}
        onChange={handleChange}
        onValidate={handleValidate}
        error={submitErrors.name}
      />

      <FormField
        type="email"
        name="email"
        label="Email"
        required
        value={form.email}
        onChange={handleChange}
        onValidate={handleValidate}
        error={submitErrors.email}
      />

      {/* digits only, exactly 10 by default */}
      <FormField
        type="tel"
        name="phone"
        label="Phone"
        required
        value={form.phone}
        onChange={handleChange}
        onValidate={handleValidate}
        error={submitErrors.phone}
      />

      {/* eye icon toggle included */}
      <FormField
        type="password"
        name="password"
        label="Password"
        required
        requireStrong
        helperText="8+ characters with upper, lower, number and symbol"
        value={form.password}
        onChange={handleChange}
        onValidate={handleValidate}
        error={submitErrors.password}
      />

      <FormField
        type="number"
        name="age"
        label="Age"
        min={1}
        max={99}
        value={form.age}
        onChange={handleChange}
        onValidate={handleValidate}
      />

      <FormField
        type="url"
        name="website"
        label="Website"
        value={form.website}
        onChange={handleChange}
        onValidate={handleValidate}
      />

      <FormField
        type="textarea"
        name="bio"
        label="Bio"
        rows={3}
        placeholder="Tell us about yourself"
        value={form.bio}
        onChange={handleChange}
      />

      <FormField
        type="select"
        name="country"
        label="Country"
        options={countries}
        value={form.country}
        onChange={handleChange}
        error={submitErrors.country}
      />

      <FormField
        type="radio"
        name="gender"
        label="Gender"
        orientation="horizontal"
        options={genders}
        value={form.gender}
        onChange={handleChange}
        error={submitErrors.gender}
      />

      <FormField
        type="multiselect"
        name="skills"
        label="Skills"
        options={skills}
        value={form.skills}
        onChange={handleChange}
        error={submitErrors.skills}
      />

      <FormField
        type="checkbox"
        name="terms"
        label="I accept the terms and conditions"
        value={form.terms}
        onChange={handleChange}
        error={submitErrors.terms}
      />

      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

export default Example;
