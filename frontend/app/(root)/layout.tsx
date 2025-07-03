import Navbar from "@/components/Navbar";
import {Toaster} from "sonner";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
}
