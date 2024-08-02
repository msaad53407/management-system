"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/types/globals";
import { capitalize } from "@/utils";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const roles: Roles[] = [
  "member",
  "district-deputy",
  "grand-administrator",
  "worthy-matron",
  "grand-officer",
  "secretary",
];

export default function SignInPage() {
  const [role, setRole] = useState<Roles | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (emailError) {
  //     console.log(emailError)
  //     const timeout = setTimeout(() => {
  //       setEmailError(null);
  //     }, 3000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [emailError]);

  // useEffect(() => {
  //   if (passwordError) {
  //     console.log(passwordError)
  //     const timeout = setTimeout(() => {
  //       setPasswordError(null);
  //     }, 3000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [passwordError]);

  return (
    <SignIn.Root>
      <div className="flex items-center justify-center w-full h-screen">
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <SignIn.Step
              name="start"
              className="flex flex-col gap-4 min-w-[350px] p-4"
            >
              <h1 className="text-4xl font-bold text-pink-600">Welcome Back</h1>

              <h3 className="text-sm font-medium text-slate-600">
                Enter your email and password to sign in
              </h3>

              <div className="flex flex-col gap-1">
                <Label>User Role</Label>
                <Select value={role} onValueChange={(r: Roles) => setRole(r)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {capitalize(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {role ? (
                <>
                  <Clerk.GlobalError className="inline-block text-sm text-destructive" />
                  <Clerk.Field name="identifier" className="w-full">
                    <Clerk.Label asChild>
                      <Label>Email address</Label>
                    </Clerk.Label>
                    <Clerk.Input type="email" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="inline-block text-sm text-destructive">
                      {({ message, code }) => {
                        if (message !== emailError) setEmailError(message);
                        return <span data-error-code={code}>{message}</span>;
                      }}
                    </Clerk.FieldError>
                  </Clerk.Field>

                  <Clerk.Field name="password" className="w-full">
                    <Clerk.Label asChild>
                      <Label>Password</Label>
                    </Clerk.Label>
                    <div className="relative">
                      <Clerk.Input
                        asChild
                        type={showPassword ? "text" : "password"}
                        required
                      >
                        <Input />
                      </Clerk.Input>
                      {!showPassword ? (
                        <Eye
                          className="absolute right-2 top-1/4 cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-2 top-1/4 cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      )}
                    </div>

                    <Clerk.FieldError className="inline-block text-sm text-destructive max-w-[315px]">
                      {({ message, code }) => {
                        if (message !== passwordError)
                          setPasswordError(message);
                        return <span data-error-code={code}>{message}</span>;
                      }}
                    </Clerk.FieldError>
                  </Clerk.Field>
                  <SignIn.Action
                    submit
                    disabled={isGlobalLoading}
                    className="w-full text-center bg-pink-600 text-white py-2 rounded-lg"
                  >
                    <Clerk.Loading>
                      {(isLoading) => {
                        return isLoading ? (
                          <LoadingSpinner
                            className="w-full"
                            spinnerClassName="size-6 border-t-white"
                          />
                        ) : (
                          "Sign In"
                        );
                      }}
                    </Clerk.Loading>
                  </SignIn.Action>
                </>
              ) : null}
            </SignIn.Step>
          )}
        </Clerk.Loading>
      </div>
    </SignIn.Root>
  );
}
