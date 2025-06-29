import Navbar from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
}
