import { cn } from "@/lib/utils";

export function Logo({ className, variant }: { className?: string; variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("p-1.5 rounded-lg", isLight ? "bg-white/20" : "bg-primary")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isLight ? "#FFFFFF" : "hsl(var(--primary-foreground))"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-hexagon"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      </div>
      <span className={cn("font-headline font-bold text-xl hidden sm:inline-block", isLight ? "text-white" : "text-foreground")}>
        HiveFund
      </span>
    </div>
  );
}
