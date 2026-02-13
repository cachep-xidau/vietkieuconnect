import { cn } from "@/lib/utils";

interface SavingsBadgeProps {
  savings: string;
  className?: string;
}

export function SavingsBadge({ savings, className }: SavingsBadgeProps) {
  return (
    <div
      className={cn(
        "bg-accent text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md",
        className
      )}
    >
      {savings}
    </div>
  );
}
