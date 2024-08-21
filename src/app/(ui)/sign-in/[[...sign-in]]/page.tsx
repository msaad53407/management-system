"use client";

import { validateRole } from "@/actions/user";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Roles } from "@/types/globals";
import { capitalizeSentence } from "@/utils";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [signInInfo, setSignInInfo] = useState<{
    email: string;
    password: string;
    role?: Roles;
  }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { isLoaded, signIn, setActive } = useSignIn();
  const searchParams = useSearchParams();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsLoading(true);

    const { data, message } = await validateRole(
      signInInfo.email,
      signInInfo.role
    );

    if (!data) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      setIsLoading(false);
      return;
    }

    try {
      const { createdSessionId } = await signIn.create({
        identifier: signInInfo.email,
        password: signInInfo.password,
        strategy: "password",
      });

      if (!createdSessionId) {
        toast({
          title: "Error",
          description: "Unable to sign in !! Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      await setActive({
        session: createdSessionId,
      });

      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      const redirectUrl = searchParams.get("redirect_url");
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to sign in !! " + error?.errors?.at(0)?.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <SignIn.Root
      fallback={
        <LoadingSpinner className="min-h-screen" spinnerClassName="size-32" />
      }
    >
      <form
        className="flex items-center justify-center w-full h-screen"
        onSubmit={handleSignIn}
      >
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <div className="flex flex-col gap-4 min-w-[350px] p-4">
              <h1 className="text-4xl font-bold text-pink-600">Welcome Back</h1>

              <h3 className="text-sm font-medium text-slate-600">
                Enter your email and password to sign in
              </h3>

              <div className="flex flex-col gap-1">
                <Label htmlFor="role">User Role</Label>
                <Select
                  value={signInInfo.role}
                  onValueChange={(r: Roles) =>
                    setSignInInfo({ ...signInInfo, role: r })
                  }
                  name="role"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {capitalizeSentence(r, "-")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {signInInfo.role ? (
                <>
                  <Clerk.GlobalError className="inline-block text-sm text-destructive" />
                  <div className="w-full flex flex-col gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      type="email"
                      id="email"
                      required
                      value={signInInfo.email}
                      onChange={(e) => {
                        setSignInInfo({
                          ...signInInfo,
                          email: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        onChange={(e) => {
                          setSignInInfo({
                            ...signInInfo,
                            password: e.target.value,
                          });
                        }}
                        value={signInInfo.password}
                      />
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
                  </div>
                  <Button
                    type="submit"
                    disabled={isGlobalLoading || isLoading}
                    variant="ghost"
                    className="w-full text-center bg-pink-600 text-white py-2 rounded-lg"
                  >
                    {isLoading ? (
                      <LoadingSpinner
                        className="w-full"
                        spinnerClassName="size-6 border-t-white"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </>
              ) : null}
            </div>
          )}
        </Clerk.Loading>
      </form>
    </SignIn.Root>
  );
}
