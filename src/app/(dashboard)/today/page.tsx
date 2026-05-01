"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AffirmationCard } from "@/features/today/components/AffirmationCard";
import { CommonStepsSection } from "@/features/today/components/CommonStepsSection";
import { MoneyLogger } from "@/features/today/components/MoneyLogger";
import { SuccessJournal } from "@/features/today/components/SuccessJournal";
import { DayTypeAForm } from "@/features/today/components/DayTypeAForm";
import { DayTypeBForm } from "@/features/today/components/DayTypeBForm";
import { DayTypeCForm } from "@/features/today/components/DayTypeCForm";
import { DayTypeDForm } from "@/features/today/components/DayTypeDForm";
import { DayTypeEForm } from "@/features/today/components/DayTypeEForm";
import { DAY_TYPE_LABELS, DAY_TYPE_COLORS, DAY_TYPE_BG } from "@/lib/day-cycle";
import { cn } from "@/lib/utils";
import type { DayType } from "@/types/practice";
import { CheckCircle2, Loader2 } from "lucide-react";

const DAY_TYPE_BADGE: Record<DayType, "gold" | "violet" | "emerald" | "blue" | "rose"> = {
  A: "gold",
  B: "violet",
  C: "emerald",
  D: "blue",
  E: "rose",
};

interface TodayState {
  dayNumber: number;
  dayType: DayType;
  hasExistingEntry: boolean;
}

export default function TodayPage() {
  const router = useRouter();
  const [todayState, setTodayState] = useState<TodayState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Form state
  const [affirmationRead, setAffirmationRead] = useState(false);
  const [commonChecks, setCommonChecks] = useState([false, false, false, false]);
  const [education, setEducation] = useState("");
  const [investment, setInvestment] = useState("");
  const [successes, setSuccesses] = useState<string[]>(Array(5).fill(""));
  const [successError, setSuccessError] = useState("");
  // Day-type specific fields
  const [typeFields, setTypeFields] = useState<Record<string, unknown>>({});

  const fetchToday = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      setTodayState({
        dayNumber: data.dayNumber,
        dayType: data.dayType,
        hasExistingEntry: !!data.entry?.completed,
      });
      if (data.entry?.completed) {
        setSubmitted(true);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  function toggleCommon(idx: number) {
    setCommonChecks((c) => c.map((v, i) => (i === idx ? !v : v)));
  }

  function updateTypeField(field: string, value: unknown) {
    setTypeFields((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const validSuccesses = successes.filter(Boolean);
    if (validSuccesses.length < 5) {
      setSuccessError("Hãy liệt kê ít nhất 5 thành công của bạn hôm nay");
      document.getElementById("successes-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSuccessError("");

    setSubmitting(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affirmationRead,
          educationDeposit: parseFloat(education) || 0,
          investmentDeposit: parseFloat(investment) || 0,
          successes: validSuccesses,
          typeFields,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Có lỗi xảy ra");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#006400]" />
      </div>
    );
  }

  if (!todayState) return null;

  const { dayNumber, dayType } = todayState;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#006400]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Xuất sắc! 🎉</h2>
          <p className="text-stone-500 max-w-xs">
            Bạn đã hoàn thành buổi thực hành ngày {dayNumber}. Hẹn gặp bạn ngày mai!
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")} size="lg">
          Xem tiến độ của bạn
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className={cn("rounded-2xl p-5 border-2", DAY_TYPE_BG[dayType])}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
              Ngày {dayNumber}
            </p>
            <h1 className="text-xl font-bold text-stone-900">
              {DAY_TYPE_LABELS[dayType]}
            </h1>
          </div>
          {/* <Badge variant={DAY_TYPE_BADGE[dayType]} className="shrink-0 text-sm px-3 py-1">
            Dạng {dayType}
          </Badge> */}
        </div>
      </div>

      {/* Affirmation */}
      <Card>
        <CardContent>
          <AffirmationCard
            read={affirmationRead}
            onMarkRead={() => setAffirmationRead(true)}
          />
        </CardContent>
      </Card>

      {/* Common steps */}
      <Card>
        <CardContent>
          <CommonStepsSection
            checked={commonChecks}
            onToggle={toggleCommon}
          />
        </CardContent>
      </Card>

      {/* Money logger */}
      <Card>
        <CardContent>
          <MoneyLogger
            education={education}
            investment={investment}
            onEducationChange={setEducation}
            onInvestmentChange={setInvestment}
          />
        </CardContent>
      </Card>

      {/* Day-type specific content */}
      <Card>
        <CardContent>
          <div className={cn("flex items-center gap-2 mb-5 pb-4 border-b border-stone-100")}>
            <div className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", DAY_TYPE_COLORS[dayType])} />
            <h2 className="font-semibold text-stone-800 text-sm">
              Bài thực hành — {DAY_TYPE_LABELS[dayType]}
            </h2>
          </div>

          {dayType === "A" && (
            <DayTypeAForm
              customAffirmation={(typeFields.customAffirmation as string) ?? ""}
              emotionDescription={(typeFields.emotionDescription as string) ?? ""}
              onChange={updateTypeField}
            />
          )}
          {dayType === "B" && (
            <DayTypeBForm
              bigGoalVAKS={(typeFields.bigGoalVAKS as string) ?? ""}
              bigGoalDone={(typeFields.bigGoalDone as string) ?? ""}
              purposeList={(typeFields.purposeList as string[]) ?? []}
              chosenPurpose={(typeFields.chosenPurpose as string) ?? ""}
              onChange={updateTypeField}
            />
          )}
          {dayType === "C" && (
            <DayTypeCForm
              shortTermGoalVAKS={(typeFields.shortTermGoalVAKS as string) ?? ""}
              shortTermGoalDone={(typeFields.shortTermGoalDone as string) ?? ""}
              worthinessReasons={(typeFields.worthinessReasons as string[]) ?? []}
              onChange={updateTypeField}
            />
          )}
          {dayType === "D" && (
            <DayTypeDForm
              supportingBeliefVAKS={(typeFields.supportingBeliefVAKS as string) ?? ""}
              valueDescription={(typeFields.valueDescription as string) ?? ""}
              onChange={updateTypeField}
            />
          )}
          {dayType === "E" && (
            <DayTypeEForm
              gratitudeList={(typeFields.gratitudeList as string[]) ?? []}
              chosenGratitude={(typeFields.chosenGratitude as string) ?? ""}
              meditationDone={(typeFields.meditationDone as boolean) ?? false}
              onChange={updateTypeField}
            />
          )}
        </CardContent>
      </Card>

      {/* Success journal */}
      <Card>
        <CardContent id="successes-section">
          <SuccessJournal
            successes={successes}
            onChange={setSuccesses}
            error={successError}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {submitError}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        className="w-full shadow-lg"
      >
        Hoàn thành ngày {dayNumber} ✓
      </Button>
    </form>
  );
}
