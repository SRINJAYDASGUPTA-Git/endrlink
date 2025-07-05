import Navbar from "@/components/Navbar";
import {Toaster} from "sonner";
import {ShootingStars} from "@/components/ui/shooting-stars";
import {StarsBackground} from "@/components/ui/stars-background";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
        <ShootingStars className={'z-[-100]'}/>
        <StarsBackground className={'z-[-100]'} />
      <Toaster />
    </div>
  );
}
