"use client";

import { Textarea } from "@/components/ui/Input";

interface DayTypeAProps {
  customAffirmation: string;
  emotionDescription: string;
  onChange: (field: string, value: string) => void;
}

export function DayTypeAForm({ customAffirmation, emotionDescription, onChange }: DayTypeAProps) {
  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
        <strong>Bước 5:</strong> VAKS — Hình dung &amp; cảm nhận <em>"Tôi thịnh vượng về tài chính"</em> thật sâu.
      </div>

      <Textarea
        label="Bước 6 — Tuyên bố giàu có của bạn"
        placeholder='VD: "Tôi đang có 1 tỷ đồng trong tài khoản và cảm thấy tự do hoàn toàn..."'
        value={customAffirmation}
        onChange={(e) => onChange("customAffirmation", e.target.value)}
        rows={4}
        hint="Viết lượng tiền hoặc mức độ giàu có bạn muốn, đọc to ít nhất 3 lần."
      />

      <Textarea
        label="Cảm xúc khi điều đó là sự thật"
        placeholder="Diễn tả cảm xúc của bạn khi tuyên bố trở thành sự thật..."
        value={emotionDescription}
        onChange={(e) => onChange("emotionDescription", e.target.value)}
        rows={3}
      />
    </div>
  );
}
