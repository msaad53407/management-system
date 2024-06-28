"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

type PublicMetadata = {
  role: string | undefined;
};

export default function Home() {
  const user = useUser();
  const metadata = user.user?.publicMetadata as PublicMetadata;
  console.log(metadata);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedOut>
        {/*@ts-ignore */}
        <SignInButton className="p-4 bg-blue-400 text-white rounded-xl">
          Sign in
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
        {metadata?.role}
      </SignedIn>
    </div>
  );
}
