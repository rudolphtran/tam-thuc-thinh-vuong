"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DAY_TYPE_LABELS, DAY_TYPE_COLORS, DAY_TYPE_BG, DAY_TYPE_BADGE } from "@/features/dashboard/components/dayTypeHelpers";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, TrendingUp, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import type { DayType } from "@/types/practice";

interface DashboardData {
  currentDayNumber: number;
  currentDayType: DayType;
  totalCompleted: number;
  totalEducationDeposit: number;
  totalInvestmentDeposit: number;
  userName: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#006400]" />
      </div>
    );
  }

  if (!data) return null;

  const {
    currentDayNumber,
    currentDayType,
    totalCompleted,
    totalEducationDeposit,
    totalInvestmentDeposit,
    userName,
  } = data;

  const firstName = userName?.split(" ").slice(-1)[0] ?? "bạn";
  const totalDeposit = totalEducationDeposit + totalInvestmentDeposit;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Chào, {firstName}! 👋
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Hành trình của bạn đang tiến về phía trước.
        </p>
      </div>

      {/* Today CTA */}
      <div className={`rounded-2xl p-5 border-2 ${DAY_TYPE_BG[currentDayType]}`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
              Hôm nay — Ngày {currentDayNumber}
            </p>
            <h2 className="text-lg font-bold text-stone-900">
              {DAY_TYPE_LABELS[currentDayType]}
            </h2>
          </div>
          {/* <Badge variant={DAY_TYPE_BADGE[currentDayType]}>Dạng {currentDayType}</Badge> */}
        </div>
        <Link href="/today">
          <Button size="md" className="w-full sm:w-auto">
            <Sparkles className="w-4 h-4" />
            Bắt đầu thực hành ngay
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-violet-600" />
              </div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                Ngày hiện tại
              </p>
            </div>
            <p className="text-3xl font-bold text-stone-900">{currentDayNumber}</p>
            <p className="text-xs text-stone-400 mt-1">Trong hành trình của bạn</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                Đã hoàn thành
              </p>
            </div>
            <p className="text-3xl font-bold text-stone-900">{totalCompleted}</p>
            <p className="text-xs text-stone-400 mt-1">Buổi thực hành</p>
          </CardContent>
        </Card>
      </div>

      {/* Money stats */}
      {totalDeposit > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-stone-800">Tổng tiền đã ghi nhận</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-400 mb-1">Quỹ Giáo Dục</p>
                <p className="font-bold text-stone-900">{formatCurrency(totalEducationDeposit)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Quỹ Đầu Tư</p>
                <p className="font-bold text-stone-900">{formatCurrency(totalInvestmentDeposit)}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-400">Tổng cộng</p>
              <p className="text-lg font-bold text-[#006400]">{formatCurrency(totalDeposit)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cycle indicator */}
      {/* <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Chu kỳ 5 ngày</h3>
          <div className="flex gap-2">
            {(["A", "B", "C", "D", "E"] as DayType[]).map((type) => (
              <div
                key={type}
                className={`flex-1 rounded-xl p-2.5 text-center transition-all ${
                  type === currentDayType
                    ? `bg-gradient-to-br ${DAY_TYPE_COLORS[type]} text-white shadow-md scale-105`
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                <div className="text-sm font-bold">{type}</div>
                <div className="text-[9px] font-medium mt-0.5 leading-tight">
                  {type === "A" && "Tuyên bố"}
                  {type === "B" && "Mục tiêu lớn"}
                  {type === "C" && "Ngắn hạn"}
                  {type === "D" && "Niềm tin"}
                  {type === "E" && "Biết ơn"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Quick link to journal */}
      <Link href="/journal">
        <div className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-3 hover:border-green-200 hover:shadow-sm transition-all cursor-pointer">
          <BookOpen className="w-5 h-5 text-stone-400" />
          <div>
            <p className="text-sm font-medium text-stone-700">Xem nhật ký của bạn</p>
            <p className="text-xs text-stone-400">{totalCompleted} ngày đã hoàn thành</p>
          </div>
          <span className="ml-auto text-stone-300 text-lg">→</span>
        </div>
      </Link>
    </div>
  );
}
