import type { DayType } from "@/types/practice";

/**
 * Tính loại ngày A-E từ số thứ tự ngày (1-based).
 * Ngày 1 → A, 2 → B, 3 → C, 4 → D, 5 → E, 6 → A, ...
 * Không giới hạn số ngày — tăng mãi mãi.
 */
export function getDayType(dayNumber: number): DayType {
  const remainder = dayNumber % 5;
  const map: Record<number, DayType> = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    0: "E",
  };
  return map[remainder];
}

export const DAY_TYPE_LABELS: Record<DayType, string> = {
  A: "Tuyên bố giàu có",
  B: "Mục tiêu lớn",
  C: "Mục tiêu ngắn hạn",
  D: "Niềm tin hỗ trợ",
  E: "Lòng biết ơn",
};

export const DAY_TYPE_COLORS: Record<DayType, string> = {
  A: "from-amber-500 to-orange-600",
  B: "from-violet-500 to-purple-700",
  C: "from-emerald-500 to-teal-600",
  D: "from-blue-500 to-indigo-600",
  E: "from-rose-500 to-pink-600",
};

export const DAY_TYPE_BG: Record<DayType, string> = {
  A: "bg-amber-50 border-amber-200",
  B: "bg-violet-50 border-violet-200",
  C: "bg-emerald-50 border-emerald-200",
  D: "bg-blue-50 border-blue-200",
  E: "bg-rose-50 border-rose-200",
};
