import Navbar from "@/components/Navbar";
import {ShootingStars} from "@/components/ui/shooting-stars";
import {StarsBackground} from "@/components/ui/stars-background";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex items-center justify-center h-screen p-6">
      <Navbar />
      {children}
        <ShootingStars className={'z-[-100]'}/>
        <StarsBackground className={'z-[-100]'} />
    </div>
  );
}
