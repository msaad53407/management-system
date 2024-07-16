import { SignIn as ClerkSignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Management System",
};

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
      <ClerkSignIn
        signUpUrl="/sign-in"
        appearance={{
          layout: {
            animations: true,
            showOptionalFields: true,
          },
        }}
      />
    </div>
  );
}
