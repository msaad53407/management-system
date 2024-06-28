import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
      <ClerkSignUp />
    </div>
  );
}
