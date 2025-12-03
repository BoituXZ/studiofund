import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoImage from "@/assets/hivefund-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-14 w-14", className)}>
      <Image
        src={LogoImage}
        alt="HiveFund Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
