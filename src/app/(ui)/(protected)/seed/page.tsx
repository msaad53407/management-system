import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { seedAll } from "@/seeders";
import { redirect } from "next/navigation";
import React from "react";

const Seed = () => {
  const seedDB = async (formData: FormData) => {
    "use server"
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;
    const password = formData.get("password");
    if (!password) {
      return {
        message: "Missing password",
      };
    }

    if (password !== "aVeryDangerousPassword") {
      return {
        message: "Incorrect password",
      };
    }

    try {
      await seedAll();
    } catch (error) {
      console.error(error);
    }
    redirect("/");
  };

  return (
    <form
      action={seedDB}
      className="min-h-screen flex items-center justify-center gap-5 flex-col w-1/2 mx-auto"
    >
      <Label htmlFor="password">Enter Password to Seed DB</Label>
      <Input type="password" name="password" id="password" />
      <SubmitButton>Seed</SubmitButton>
    </form>
  );
};

export default Seed;
