import { Navbar } from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 selection:bg-blue-500 selection:text-white">
      <Navbar />
      {children}
    </div>
  );
}
