"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Message {
  _id: string;
  title: string;
  content: string;
}

interface MessagePopupProps {
  onDismiss?: () => void;
}

export function MessagePopup({ onDismiss }: MessagePopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const storageKey = "message_popup_dismissed";
    if (sessionStorage.getItem(storageKey)) {
      setDismissed(true);
      return;
    }

    fetchActiveMessages();
  }, []);

  const fetchActiveMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("message_popup_dismissed", "true");
    setDismissed(true);
    onDismiss?.();
  };

  if (loading || dismissed || messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900">Thông báo</h2>
            <button
              onClick={handleDismiss}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message._id}
                className={`pb-4 ${
                  index < messages.length - 1 ? "border-b border-stone-200" : ""
                }`}
              >
                <h3 className="font-semibold text-emerald-700 mb-2">
                  {message.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 mt-4 border-t border-stone-200">
            <Button
              onClick={handleDismiss}
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Đã hiểu
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
