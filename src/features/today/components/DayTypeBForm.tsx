"use client";

import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface DayTypeBProps {
  bigGoalVAKS: string;
  bigGoalDone: string;
  purposeList: string[];
  chosenPurpose: string;
  onChange: (field: string, value: string | string[]) => void;
}

export function DayTypeBForm({
  bigGoalVAKS,
  bigGoalDone,
  purposeList,
  chosenPurpose,
  onChange,
}: DayTypeBProps) {
  const list = purposeList.length >= 5 ? purposeList : [...purposeList, ...Array(5 - purposeList.length).fill("")];

  function updatePurpose(idx: number, value: string) {
    const next = [...list];
    next[idx] = value;
    onChange("purposeList", next);
  }

  function removePurpose(idx: number) {
    if (list.length <= 5) {
      updatePurpose(idx, "");
    } else {
      onChange("purposeList", list.filter((_, i) => i !== idx));
    }
  }

  return (
    <div className="space-y-5">
      <Textarea
        label="Bước 5 — VAKS Mục Tiêu Lớn"
        placeholder="Hình dung và cảm nhận mục tiêu lớn của bạn..."
        value={bigGoalVAKS}
        onChange={(e) => onChange("bigGoalVAKS", e.target.value)}
        rows={3}
        hint="Nhắm mắt, hình dung chi tiết — âm thanh, cảm giác, hình ảnh."
      />

      <Textarea
        label="Bước 6 — Pháp 'Done' cho Mục Tiêu Lớn"
        placeholder="Viết: 'Done! Tôi đã đạt được...' như thể đã xong rồi..."
        value={bigGoalDone}
        onChange={(e) => onChange("bigGoalDone", e.target.value)}
        rows={3}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-700">
            Bước 7 — Mục đích kiếm tiền của bạn
          </label>
          <span className="text-xs text-stone-400">{list.filter(Boolean).length}/5 tối thiểu</span>
        </div>
        <p className="text-xs text-stone-400 -mt-1">
          Liệt kê 5–10 mục đích cụ thể và quan trọng khiến bạn muốn kiếm nhiều tiền hơn.
        </p>
        {list.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <Textarea
              placeholder={`Mục đích thứ ${idx + 1}...`}
              value={item}
              onChange={(e) => updatePurpose(idx, e.target.value)}
              rows={2}
              className="flex-1"
            />
            {idx >= 5 && (
              <button type="button" onClick={() => removePurpose(idx)} className="mt-2.5 text-stone-300 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("purposeList", [...list.filter(Boolean), ""])}
          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
        >
          <Plus className="w-4 h-4" />
          Thêm mục đích
        </Button>
      </div>

      <Textarea
        label="Chọn 1 mục đích quan trọng nhất — giải thích tại sao"
        placeholder="Mục đích quan trọng nhất với tôi là... vì nó..."
        value={chosenPurpose}
        onChange={(e) => onChange("chosenPurpose", e.target.value)}
        rows={4}
      />
    </div>
  );
}
