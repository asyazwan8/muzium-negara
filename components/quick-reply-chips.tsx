"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Quick-reply suggestion chips shown after a message to reduce typing friction.
 */
export function QuickReplyChips({
  options,
  onSelect,
  disabled,
  className,
}: {
  options: readonly string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  if (!options?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className="bg-card hover:bg-accent rounded-full"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
