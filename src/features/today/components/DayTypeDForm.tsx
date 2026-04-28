"use client";

import { Textarea } from "@/components/ui/Input";

interface DayTypeDProps {
  supportingBeliefVAKS: string;
  valueDescription: string;
  onChange: (field: string, value: string) => void;
}

export function DayTypeDForm({ supportingBeliefVAKS, valueDescription, onChange }: DayTypeDProps) {
  return (
    <div className="space-y-5">
      <Textarea
        label="Bước 5 — VAKS Niềm Tin Hỗ Trợ"
        placeholder='VAKS niềm tin hỗ trợ tiền và sự giàu có. VD: "Tiền đến dễ dàng và tự nhiên với tôi"...'
        value={supportingBeliefVAKS}
        onChange={(e) => onChange("supportingBeliefVAKS", e.target.value)}
        rows={3}
        hint="Chọn niềm tin trái ngược với các niềm tin tiêu cực của bạn về tiền."
      />

      <Textarea
        label="Bước 6 — Giá trị bạn tạo ra cho người khác"
        placeholder="Tôi giúp ích người khác bằng cách... Sản phẩm/dịch vụ/tài năng của tôi có giá trị vì..."
        value={valueDescription}
        onChange={(e) => onChange("valueDescription", e.target.value)}
        rows={5}
        hint="Diễn tả rõ lợi ích, giá trị bạn đóng góp vào cuộc sống của người khác."
      />
    </div>
  );
}
