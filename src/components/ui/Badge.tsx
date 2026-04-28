import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "violet" | "emerald" | "blue" | "rose" | "stone";
  className?: string;
}

export function Badge({ children, variant = "stone", className }: BadgeProps) {
  const variants = {
    gold: "bg-amber-100 text-amber-800 border border-amber-200",
    violet: "bg-violet-100 text-violet-800 border border-violet-200",
    emerald: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
    rose: "bg-rose-100 text-rose-800 border border-rose-200",
    stone: "bg-stone-100 text-stone-700 border border-stone-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
