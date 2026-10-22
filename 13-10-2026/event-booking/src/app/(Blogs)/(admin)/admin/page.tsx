"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";

const EMAIL = "Dhara@gmail.com";
const PASSWORD = "Dhara915";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = (event: FormEvent) => {
  event.preventDefault();

  console.log("Entered password:", JSON.stringify(password));
  console.log("Expected password:", JSON.stringify(PASSWORD));

  const enteredEmail = email.trim().toLowerCase();
  const expectedEmail = EMAIL.trim().toLowerCase();

  const emailMatches = enteredEmail === expectedEmail;
  const passwordMatches = password === PASSWORD;


  if (!emailMatches || !passwordMatches) {
    setError("Invalid email or password");
    return;
  };

  setError("");

  document.cookie = "admin-auth=true; path=/; max-age=28800";

  console.log("Cookie set:", document.cookie);

  router.replace("/admin/dashboard");
  router.refresh();
};

  return (
   <div className="flex min-h-[80vh] ">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line mx-auto my-auto  bg-card p-4  shadow-sm "
      >
        <h1 className="text-2xl font-bold">Admin login</h1>
        <h4 className="mb-6 text-sm text-muted-foreground">Sign in to manage your blog.</h4>

        <div className="flex flex-col gap-4">
          <FormField
            type="email"
            name="email"
            label="Email"
            placeholder="admin@example.com"
            value={email}
            onChange={setEmail}
            required
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={setPassword}
            required
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-6 w-full hover:bg-brand bg-brand">
          Sign in
        </Button>

        
      </form>
</div>
  );
};

export default page;