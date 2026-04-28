"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { COMMON_STEPS } from "@/lib/template-data";

interface CommonStepsProps {
  checked: boolean[];
  onToggle: (idx: number) => void;
}

export function CommonStepsSection({ checked, onToggle }: CommonStepsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
        Các bước chung
      </h3>
      {COMMON_STEPS.map((step, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onToggle(idx)}
          className={cn(
            "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
            checked[idx]
              ? "bg-green-50 border border-green-200"
              : "bg-stone-50 border border-stone-200 hover:border-green-200"
          )}
        >
          {checked[idx] ? (
            <CheckCircle2 className="w-5 h-5 text-[#006400] mt-0.5 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-stone-300 mt-0.5 shrink-0" />
          )}
          <span
            className={cn(
              "text-sm",
              checked[idx]
                ? "text-green-800 line-through"
                : "text-stone-700"
            )}
          >
            {step}
          </span>
        </button>
      ))}
    </div>
  );
}
