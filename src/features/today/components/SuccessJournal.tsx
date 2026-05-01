"use client";

import { Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface SuccessJournalProps {
  successes: string[];
  onChange: (successes: string[]) => void;
  error?: string;
}

export function SuccessJournal({ successes, onChange, error }: SuccessJournalProps) {
  const filled = successes.filter(Boolean).length;

  function handleChange(value: string) {
    const lines = value.split("\n");
    onChange(lines);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
          Ghi nhận thành công hôm nay
        </h3>
        <span className={cn(
          "text-xs font-medium",
          filled >= 5 ? "text-emerald-600" : "text-stone-400"
        )}>
          {filled}/5 tối thiểu
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <Textarea
        placeholder={"Mỗi dòng là một thành công...\nVí dụ: Tôi đã hoàn thành bài tập sáng nay\nTôi đã gửi tiền vào quỹ đầu tư\n..."}
        value={successes.join("\n")}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        className="w-full resize-y"
      />
    </div>
  );
}

