import type { DayType } from "@/types/practice";

export const DAY_TYPE_LABELS: Record<DayType, string> = {
  A: "Tuyên bố giàu có",
  B: "Mục tiêu lớn",
  C: "Mục tiêu ngắn hạn",
  D: "Niềm tin hỗ trợ",
  E: "Lòng biết ơn",
};

export const DAY_TYPE_COLORS: Record<DayType, string> = {
  A: "from-green-500 to-[#006400]",
  B: "from-violet-500 to-purple-700",
  C: "from-emerald-500 to-teal-600",
  D: "from-blue-500 to-indigo-600",
  E: "from-rose-500 to-pink-600",
};

export const DAY_TYPE_BG: Record<DayType, string> = {
  A: "bg-green-50 border-green-200",
  B: "bg-violet-50 border-violet-200",
  C: "bg-emerald-50 border-emerald-200",
  D: "bg-blue-50 border-blue-200",
  E: "bg-rose-50 border-rose-200",
};

export const DAY_TYPE_BADGE: Record<DayType, "gold" | "violet" | "emerald" | "blue" | "rose"> = {
  A: "gold",
  B: "violet",
  C: "emerald",
  D: "blue",
  E: "rose",
};
