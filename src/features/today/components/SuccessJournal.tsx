"use client";

import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessJournalProps {
  successes: string[];
  onChange: (successes: string[]) => void;
  error?: string;
}

export function SuccessJournal({ successes, onChange, error }: SuccessJournalProps) {
  const list = successes.length >= 5 ? successes : [...successes, ...Array(5 - successes.length).fill("")];

  function update(idx: number, value: string) {
    const next = [...list];
    next[idx] = value;
    onChange(next.filter((_, i) => i < Math.max(5, next.filter(Boolean).length + 1)));
  }

  function addMore() {
    onChange([...list.filter((s) => s !== ""), ""]);
  }

  function remove(idx: number) {
    if (list.length <= 5) {
      update(idx, "");
    } else {
      const next = list.filter((_, i) => i !== idx);
      onChange(next.length >= 5 ? next : [...next, ...Array(5 - next.length).fill("")]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
          Ghi nhận thành công hôm nay
        </h3>
        <span className={cn(
          "text-xs font-medium",
          list.filter(Boolean).length >= 5 ? "text-emerald-600" : "text-stone-400"
        )}>
          {list.filter(Boolean).length}/5 tối thiểu
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <div className="space-y-2">
        {list.map((s, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-3 w-6 h-6 rounded-full bg-green-100 text-[#006400] text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <Textarea
              placeholder={`Thành công thứ ${idx + 1}...`}
              value={s}
              onChange={(e) => update(idx, e.target.value)}
              rows={2}
              className="flex-1"
            />
            {idx >= 5 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="mt-3 text-stone-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addMore}
        className="text-[#006400] hover:text-green-800 hover:bg-green-50"
      >
        <Plus className="w-4 h-4" />
        Thêm thành công khác
      </Button>
    </div>
  );
}
