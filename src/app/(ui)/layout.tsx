import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import LoadingSpinner from "@/components/LoadingSpinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Management System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className + " overflow-y-hidden"}>
          <ClerkLoading>
            <LoadingSpinner
              className="min-h-screen"
              spinnerClassName="size-32"
            />
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
        <Toaster />
      </html>
    </ClerkProvider>
  );
}
