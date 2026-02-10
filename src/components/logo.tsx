import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoImage from "@/assets/hivefund-logo.png";

export function Logo({ className, variant, hideText }: { className?: string; variant?: "light" | "dark"; hideText?: boolean }) {
  const isLight = variant === "light";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-32 w-32">
        <Image
          src={LogoImage}
          alt="HiveFund Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {!hideText && (
        <span className={cn("font-headline font-bold text-xl hidden sm:inline-block", isLight ? "text-white" : "text-primary")}>
          HiveFund
        </span>
      )}
    </div>
  );
}
