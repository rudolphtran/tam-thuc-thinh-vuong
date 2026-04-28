"use client";

import { Textarea } from "@/components/ui/Input";

interface DayTypeCProps {
  shortTermGoalVAKS: string;
  shortTermGoalDone: string;
  worthinessReasons: string[];
  onChange: (field: string, value: string | string[]) => void;
}

export function DayTypeCForm({
  shortTermGoalVAKS,
  shortTermGoalDone,
  worthinessReasons,
  onChange,
}: DayTypeCProps) {
  const reasons = worthinessReasons.length >= 3 ? worthinessReasons : [...worthinessReasons, ...Array(3 - worthinessReasons.length).fill("")];

  return (
    <div className="space-y-5">
      <Textarea
        label="Bước 5 — VAKS Mục Tiêu Ngắn Hạn"
        placeholder="Hình dung và cảm nhận mục tiêu ngắn hạn của bạn..."
        value={shortTermGoalVAKS}
        onChange={(e) => onChange("shortTermGoalVAKS", e.target.value)}
        rows={3}
      />

      <Textarea
        label="Bước 6 — Pháp 'Done' cho Mục Tiêu Ngắn Hạn"
        placeholder="Done! Tôi đã hoàn thành..."
        value={shortTermGoalDone}
        onChange={(e) => onChange("shortTermGoalDone", e.target.value)}
        rows={3}
      />

      <div className="space-y-3">
        <label className="text-sm font-medium text-stone-700 block">
          Bước 7 — 3 lý do bạn xứng đáng với sự thịnh vượng
        </label>
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <Textarea
              placeholder={`Lý do thứ ${idx + 1}...`}
              value={reason}
              onChange={(e) => {
                const next = [...reasons];
                next[idx] = e.target.value;
                onChange("worthinessReasons", next);
              }}
              rows={2}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
