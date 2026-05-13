"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };

    image.src = objectUrl;
  });
}

async function compressImage(file: File): Promise<File> {
  const image = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.8);
  });

  if (!blob) {
    throw new Error("Image compression failed");
  }

  return new File([blob], `${file.name.replace(/\.[^/.]+$/, "") || "daily-image"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

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
  const [dailyImageUrl, setDailyImageUrl] = useState("");
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [imageUploadPublicId, setImageUploadPublicId] = useState("");
  const [persistedImagePublicId, setPersistedImagePublicId] = useState("");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  // Day-type specific fields
  const [typeFields, setTypeFields] = useState<Record<string, unknown>>({});
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  async function fetchToday() {
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
      if (typeof data.entry?.dailyImageUrl === "string") {
        setDailyImageUrl(data.entry.dailyImageUrl);
        setImageUploadUrl(data.entry.dailyImageUrl);
      }
      if (typeof data.entry?.dailyImagePublicId === "string") {
        setImageUploadPublicId(data.entry.dailyImagePublicId);
        setPersistedImagePublicId(data.entry.dailyImagePublicId);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchToday();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  function toggleCommon(idx: number) {
    setCommonChecks((c) => c.map((v, i) => (i === idx ? !v : v)));
  }

  function updateTypeField(field: string, value: unknown) {
    setTypeFields((f) => ({ ...f, [field]: value }));
  }

  async function deleteUploadedImage(publicId: string) {
    try {
      await fetch("/api/uploads/daily-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    } catch {
      // Ignore cleanup failures on best-effort deletion
    }
  }

  function clearSelectedImage() {
    if (imageUploadPublicId && imageUploadPublicId !== persistedImagePublicId) {
      void deleteUploadedImage(imageUploadPublicId);
    }
    setDailyImageUrl("");
    setImageUploadUrl("");
    setImageUploadPublicId("");
    setPendingImageFile(null);
    setImageError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");

    if (imageUploadPublicId && imageUploadPublicId !== persistedImagePublicId) {
      void deleteUploadedImage(imageUploadPublicId);
    }

    setImageUploadUrl("");
    setImageUploadPublicId("");

    if (!file.type.startsWith("image/")) {
      setImageError("Vui lòng chọn file ảnh hợp lệ");
      clearSelectedImage();
      return;
    }

    try {
      const compressed = await compressImage(file);
      if (compressed.size > MAX_IMAGE_SIZE_BYTES) {
        setImageError("Ảnh sau khi nén vẫn quá lớn, vui lòng chọn ảnh khác");
        clearSelectedImage();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          setImageError("Không thể đọc ảnh, vui lòng thử lại");
          clearSelectedImage();
          return;
        }
        setPendingImageFile(compressed);
        setDailyImageUrl(reader.result);
      };
      reader.onerror = () => {
        setImageError("Không thể đọc ảnh, vui lòng thử lại");
        clearSelectedImage();
      };
      reader.readAsDataURL(compressed);
    } catch {
      setImageError("Không thể nén ảnh, vui lòng thử ảnh khác");
      clearSelectedImage();
    }
  }

  async function uploadImageIfNeeded() {
    if (!pendingImageFile) {
      return { url: imageUploadUrl, publicId: imageUploadPublicId };
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", pendingImageFile);

      const uploadRes = await fetch("/api/uploads/daily-image", {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(data.error ?? "Không thể tải ảnh lên");
      }

      const uploadedUrl = String(data.url ?? "");
      const uploadedPublicId = String(data.publicId ?? "");
      setImageUploadUrl(uploadedUrl);
      setImageUploadPublicId(uploadedPublicId);
      setPendingImageFile(null);
      setDailyImageUrl(uploadedUrl);
      return { url: uploadedUrl, publicId: uploadedPublicId };
    } finally {
      setImageUploading(false);
    }
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
      const uploadedImage = await uploadImageIfNeeded();

      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affirmationRead,
          educationDeposit: parseFloat(education) || 0,
          investmentDeposit: parseFloat(investment) || 0,
          successes: validSuccesses,
          typeFields,
          dailyImageUrl: uploadedImage.url || undefined,
          dailyImagePublicId: uploadedImage.publicId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Có lỗi xảy ra");
        return;
      }

      setPersistedImagePublicId(uploadedImage.publicId);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Lỗi kết nối, vui lòng thử lại");
      }
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

      {/* Daily image */}
      <Card>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h2 className="font-semibold text-stone-800 text-sm">Ảnh hôm nay (tuỳ chọn)</h2>
              <p className="text-xs text-stone-500 mt-1">Tải lên 1 ảnh để lưu lại hành trình của bạn (tối đa 2MB).</p>
            </div>

            <label
              htmlFor="daily-image-upload"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-4 text-sm text-stone-600 hover:border-[#006400] hover:text-[#006400] transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Chọn ảnh từ thiết bị
            </label>
            <input
              ref={imageInputRef}
              id="daily-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="hidden"
            />

            {imageError && (
              <p className="text-xs text-red-600">{imageError}</p>
            )}

            {dailyImageUrl && (
              <div className="space-y-2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                  <Image
                    src={dailyImageUrl}
                    alt="Ảnh thực hành hôm nay"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={clearSelectedImage}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Xoá ảnh đã chọn
                </button>
              </div>
            )}
          </div>
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
        loading={submitting || imageUploading}
        className="w-full shadow-lg"
      >
        {imageUploading ? "Đang tải ảnh..." : `Hoàn thành ngày ${dayNumber} ✓`}
      </Button>
    </form>
  );
}
