import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex gap-2 w-full min-h-screen max-h-screen">
      <Sidebar />
      <div className="flex flex-col gap-4 min-h-screen overflow-y-auto w-full">
        <Header />
        {children}
        <Footer />
      </div>
    </main>
  );
}
