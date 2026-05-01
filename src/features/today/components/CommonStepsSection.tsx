"use client";

import { cn } from "@/lib/utils";
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
            <span className="w-5 h-5 mt-0.5 shrink-0 rounded border-2 border-[#006400] bg-[#006400] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <span className="w-5 h-5 mt-0.5 shrink-0 rounded border-2 border-stone-300 bg-white" />
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
