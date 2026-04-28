"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DAY_TYPE_LABELS, DAY_TYPE_BG, DAY_TYPE_BADGE } from "@/features/dashboard/components/dayTypeHelpers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, ChevronDown, ChevronUp, CheckCircle2, Share2 } from "lucide-react";
import type { DayType } from "@/types/practice";

interface EntryDoc {
  _id: string;
  dayNumber: number;
  dayType: DayType;
  completed: boolean;
  affirmationRead: boolean;
  educationDeposit: number;
  investmentDeposit: number;
  successes: string[];
  typeFields: Record<string, unknown>;
  createdAt: string;
}

function EntryCard({ entry }: { entry: EntryDoc }) {
  const [expanded, setExpanded] = useState(false);

  function buildShareText() {
    const lines = [
      `✦ Ngày ${entry.dayNumber} — ${DAY_TYPE_LABELS[entry.dayType]}`,
      `📅 ${formatDate(entry.createdAt)}`,
      ``,
      `🏆 Thành công hôm nay:`,
      ...entry.successes.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `💰 Quỹ Giáo Dục: ${formatCurrency(entry.educationDeposit)}`,
      `📈 Quỹ Đầu Tư: ${formatCurrency(entry.investmentDeposit)}`,
      ``,
      `#TâmThứcThịnhVượng #ThịnhVượngTàiChính`,
    ];
    return lines.join("\n");
  }

  function handleShare() {
    const text = buildShareText();
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(window.location.origin)}`;
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    }
  }

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${DAY_TYPE_BG[entry.dayType]}`}>
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-stone-800">Ngày {entry.dayNumber}</span>
              <Badge variant={DAY_TYPE_BADGE[entry.dayType]}>Dạng {entry.dayType}</Badge>
              {entry.completed && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-stone-400">{formatDate(entry.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-white/60 text-stone-400 hover:text-blue-600 transition-colors"
              title="Chia sẻ"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="p-1.5 rounded-lg hover:bg-white/60 text-stone-400 hover:text-stone-700 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick preview — successes */}
        {!expanded && entry.successes.length > 0 && (
          <p className="text-sm text-stone-600 mt-2 line-clamp-1">
            ✓ {entry.successes[0]}
            {entry.successes.length > 1 && ` và ${entry.successes.length - 1} thành công khác`}
          </p>
        )}
      </div>

      {expanded && (
        <div className="bg-white/70 border-t border-white/60 px-4 py-4 space-y-4">
          {/* Money */}
          {(entry.educationDeposit > 0 || entry.investmentDeposit > 0) && (
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-xs text-stone-400">Quỹ Giáo Dục</p>
                <p className="font-semibold text-stone-800">{formatCurrency(entry.educationDeposit)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">Quỹ Đầu Tư</p>
                <p className="font-semibold text-stone-800">{formatCurrency(entry.investmentDeposit)}</p>
              </div>
            </div>
          )}

          {/* Successes */}
          {entry.successes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Thành công</p>
              <ul className="space-y-1">
                {entry.successes.map((s, i) => (
                  <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                    <span className="text-[#006400] font-bold shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Type-specific highlights */}
          {entry.typeFields && Object.keys(entry.typeFields).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Bài thực hành
              </p>
              <div className="space-y-2 text-sm text-stone-700">
                {entry.dayType === "A" && (
                  <>
                    {Boolean(entry.typeFields.customAffirmation) && (
                      <p><span className="font-medium">Tuyên bố:</span> {entry.typeFields.customAffirmation as string}</p>
                    )}
                    {Boolean(entry.typeFields.emotionDescription) && (
                      <p><span className="font-medium">Cảm xúc:</span> {entry.typeFields.emotionDescription as string}</p>
                    )}
                  </>
                )}
                {entry.dayType === "B" && Boolean(entry.typeFields.chosenPurpose) && (
                  <p><span className="font-medium">Mục đích:</span> {entry.typeFields.chosenPurpose as string}</p>
                )}
                {entry.dayType === "C" && Boolean(entry.typeFields.worthinessReasons) && (
                  <div>
                    <p className="font-medium mb-1">Lý do xứng đáng:</p>
                    {(entry.typeFields.worthinessReasons as string[]).filter(Boolean).map((r, i) => (
                      <p key={i} className="text-stone-600">• {r}</p>
                    ))}
                  </div>
                )}
                {entry.dayType === "D" && Boolean(entry.typeFields.valueDescription) && (
                  <p><span className="font-medium">Giá trị:</span> {entry.typeFields.valueDescription as string}</p>
                )}
                {entry.dayType === "E" && Boolean(entry.typeFields.chosenGratitude) && (
                  <p><span className="font-medium">Điều biết ơn:</span> {entry.typeFields.chosenGratitude as string}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DAY_TYPE_FILTER: DayType[] = ["A", "B", "C", "D", "E"];

export default function JournalPage() {
  const [entries, setEntries] = useState<EntryDoc[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<DayType | "">("");

  const LIMIT = 10;

  const fetchEntries = useCallback(
    async (p: number, dayTypeFilter: string, reset: boolean) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
        if (dayTypeFilter) params.set("dayType", dayTypeFilter);
        const res = await fetch(`/api/entries/history?${params}`);
        const data = await res.json();
        setTotal(data.total);
        if (reset) {
          setEntries(data.entries);
        } else {
          setEntries((prev) => [...prev, ...data.entries]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchEntries(1, filter, true);
  }, [filter, fetchEntries]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchEntries(next, filter, false);
  }

  const hasMore = entries.length < total;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Nhật ký thực hành</h1>
        <p className="text-stone-500 text-sm mt-1">{total} ngày đã hoàn thành</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === ""
              ? "bg-stone-900 text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
          }`}
        >
          Tất cả
        </button>
        {DAY_TYPE_FILTER.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === type
                ? "bg-stone-900 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
            }`}
          >
            Dạng {type}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-[#006400]" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-stone-400 text-sm">
              Chưa có ngày nào được hoàn thành.{" "}
              <a href="/today" className="text-[#006400] font-medium hover:underline">
                Bắt đầu ngay hôm nay!
              </a>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={loadMore}
            loading={loadingMore}
          >
            Tải thêm
          </Button>
        </div>
      )}
    </div>
  );
}
