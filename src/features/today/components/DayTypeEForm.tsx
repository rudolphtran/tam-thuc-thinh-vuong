"use client";

import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayTypeEProps {
  gratitudeList: string[];
  chosenGratitude: string;
  meditationDone: boolean;
  onChange: (field: string, value: string | string[] | boolean) => void;
}

export function DayTypeEForm({ gratitudeList, chosenGratitude, meditationDone, onChange }: DayTypeEProps) {
  const list = gratitudeList.length >= 10 ? gratitudeList : [...gratitudeList, ...Array(10 - gratitudeList.length).fill("")];

  function updateItem(idx: number, value: string) {
    const next = [...list];
    next[idx] = value;
    onChange("gratitudeList", next);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-700">
            Bước 5 — Lòng biết ơn sâu sắc
          </label>
          <span className={cn(
            "text-xs font-medium",
            list.filter(Boolean).length >= 10 ? "text-emerald-600" : "text-stone-400"
          )}>
            {list.filter(Boolean).length}/10 tối thiểu
          </span>
        </div>
        <p className="text-xs text-stone-400">
          Liệt kê ít nhất 10 người / điều bạn biết ơn trong cuộc đời.
        </p>
        {list.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Heart className="mt-3 w-4 h-4 text-rose-300 shrink-0" />
            <Textarea
              placeholder={`Điều biết ơn thứ ${idx + 1}...`}
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              rows={2}
              className="flex-1"
            />
            {idx >= 10 && (
              <button
                type="button"
                onClick={() => onChange("gratitudeList", list.filter((_, i) => i !== idx))}
                className="mt-3 text-stone-300 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("gratitudeList", [...list.filter(Boolean), ""])}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <Plus className="w-4 h-4" />
          Thêm điều biết ơn
        </Button>
      </div>

      <Textarea
        label="Điều bạn biết ơn nhất — tại sao?"
        placeholder="Chọn 1 trong những điều trên và diễn tả sâu hơn tại sao bạn biết ơn và nó khiến bạn cảm thấy thế nào..."
        value={chosenGratitude}
        onChange={(e) => onChange("chosenGratitude", e.target.value)}
        rows={4}
      />

      <button
        type="button"
        onClick={() => onChange("meditationDone", !meditationDone)}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
          meditationDone
            ? "border-rose-300 bg-rose-50"
            : "border-stone-200 bg-stone-50 hover:border-rose-200"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            meditationDone ? "bg-rose-500" : "bg-stone-200"
          )}
        >
          <Heart className={cn("w-4 h-4", meditationDone ? "text-white" : "text-stone-400")} />
        </div>
        <div>
          <p className={cn("text-sm font-medium", meditationDone ? "text-rose-800" : "text-stone-700")}>
            Bước 6 — Thiền Kết Nối Tâm Nguồn
          </p>
          <p className="text-xs text-stone-400">Chữa lành mối quan hệ với tiền • (Bonus) Chữa lành luân xa 1</p>
        </div>
        {meditationDone && <span className="ml-auto text-rose-500 font-medium text-sm">✓ Xong</span>}
      </button>
    </div>
  );
}
