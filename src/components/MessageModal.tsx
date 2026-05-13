"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  initialData?: { title: string; content: string };
  isLoading?: boolean;
  title?: string;
}

export function MessageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title = "Tạo thông điệp",
}: MessageModalProps) {
  const [formData, setFormData] = useState(
    initialData || { title: "", content: "" }
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    if (!formData.content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ title: "", content: "" });
      onClose();
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Tiêu đề
              </label>
              <Input
                type="text"
                placeholder="Nhập tiêu đề thông điệp"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                maxLength={200}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Nội dung
              </label>
              <textarea
                placeholder="Nhập nội dung thông điệp"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                maxLength={1000}
                disabled={isLoading}
                rows={5}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <div className="text-xs text-stone-500 mt-1">
                {formData.content.length}/1000
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-stone-100 text-stone-900 hover:bg-stone-200"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isLoading ? "Đang xử lý..." : "Lưu"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
