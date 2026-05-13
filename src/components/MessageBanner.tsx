"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Message {
  _id: string;
  title: string;
  content: string;
}

interface MessageBannerProps {
  onDismiss?: () => void;
}

export function MessageBanner({ onDismiss }: MessageBannerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
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
    setDismissed(true);
    onDismiss?.();
  };

  if (loading || dismissed || messages.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-stone-200 shadow-sm sticky top-12 md:top-14 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            {messages.map((message) => (
              <div key={message._id} className="mb-2 last:mb-0">
                <div className="font-medium text-base text-emerald-700">
                  {message.title}
                </div>
                <div className="text-base text-stone-600 line-clamp-1">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors pt-0.5"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
