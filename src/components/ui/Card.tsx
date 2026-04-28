import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-white rounded-2xl shadow-sm border border-stone-100",
    elevated: "bg-white rounded-2xl shadow-md border border-stone-100",
    bordered: "bg-white rounded-2xl border-2 border-stone-200",
  };
  return (
    <div className={cn(variants[variant], className)}>{children}</div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-stone-100", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return <div id={id} className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-6 py-4 pt-0 flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
