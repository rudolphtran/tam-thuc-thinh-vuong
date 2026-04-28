"use client";

import { useState } from "react";
import { PROSPERITY_DECLARATION } from "@/lib/template-data";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffirmationCardProps {
  read: boolean;
  onMarkRead: () => void;
}

export function AffirmationCard({ read, onMarkRead }: AffirmationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border-2 overflow-hidden transition-all",
        read ? "border-green-300 bg-green-50" : "border-stone-200 bg-white"
      )}
    >
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-800 text-sm">
            ✦ Tuyên Bố Tâm Thức Thịnh Vượng
          </h3>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-stone-400 hover:text-stone-600 transition-colors"
            aria-label={expanded ? "Thu gọn" : "Xem đầy đủ"}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {expanded ? (
          <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
            {PROSPERITY_DECLARATION}
          </p>
        ) : (
          <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
            {PROSPERITY_DECLARATION}
          </p>
        )}
      </div>

      <div className="border-t border-stone-100 px-5 py-3">
        <button
          type="button"
          onClick={onMarkRead}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            read
              ? "text-[#006400] cursor-default"
              : "text-stone-500 hover:text-[#006400]"
          )}
        >
          <CheckCircle2
            className={cn("w-4 h-4", read ? "text-[#006400]" : "text-stone-300")}
          />
          {read ? "Đã đọc xong ✓" : "Đánh dấu đã đọc"}
        </button>
      </div>
    </div>
  );
}
