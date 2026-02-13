"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Interactive star rating input component
 * Supports click, hover preview, and keyboard navigation
 */
export function RatingInput({ value, onChange, disabled = false, className }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(rating);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn("flex gap-1", className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = rating <= displayValue;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !disabled && setHoverValue(rating)}
            onKeyDown={(e) => handleKeyDown(e, rating)}
            disabled={disabled}
            className={cn(
              "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
              disabled && "cursor-not-allowed opacity-50"
            )}
            aria-label={`Rate ${rating} out of 5 stars`}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                !disabled && "hover:scale-110"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
