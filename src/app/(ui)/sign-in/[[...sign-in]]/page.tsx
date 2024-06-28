import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
      <ClerkSignIn />
    </div>
  );
}
