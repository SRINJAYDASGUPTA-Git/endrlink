import {ShootingStars} from "@/components/ui/shooting-stars";
import {StarsBackground} from "@/components/ui/stars-background";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex flex-col items-center h-[90vh] justify-center">
      {children}
        <ShootingStars className={'z-[-100]'}/>
        <StarsBackground className={'z-[-100]'} />
      </div>
    );
}