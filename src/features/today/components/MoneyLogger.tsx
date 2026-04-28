"use client";

import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";

interface MoneyLoggerProps {
  education: string;
  investment: string;
  onEducationChange: (v: string) => void;
  onInvestmentChange: (v: string) => void;
}

export function MoneyLogger({
  education,
  investment,
  onEducationChange,
  onInvestmentChange,
}: MoneyLoggerProps) {
  const total =
    (parseFloat(education) || 0) + (parseFloat(investment) || 0);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
        Ghi nhận gửi tiền
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quỹ Giáo Dục (VNĐ)"
          type="number"
          min="0"
          step="1000"
          placeholder="0"
          value={education}
          onChange={(e) => onEducationChange(e.target.value)}
        />
        <Input
          label="Quỹ Đầu Tư (VNĐ)"
          type="number"
          min="0"
          step="1000"
          placeholder="0"
          value={investment}
          onChange={(e) => onInvestmentChange(e.target.value)}
        />
      </div>
      {total > 0 && (
        <p className="text-xs text-amber-700 font-medium">
          Tổng hôm nay: {formatCurrency(total)}
        </p>
      )}
    </div>
  );
}
