"use client";

import { useEffect, useState } from "react";
import { MessageModal } from "@/components/MessageModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";

interface Message {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllMessages();
  }, []);

  const fetchAllMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages/manage");
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

  const handleCreateMessage = async (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchAllMessages();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMessage = async (
    messageId: string,
    data: { title: string; content: string }
  ) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchAllMessages();
        setEditingMessage(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Bạn chắc chắn muốn xoá thông điệp này?")) return;

    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchAllMessages();
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleToggleActive = async (message: Message) => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !message.isActive }),
      });

      if (res.ok) {
        await fetchAllMessages();
      }
    } catch (error) {
      console.error("Failed to toggle message status:", error);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (data: { title: string; content: string }) => {
    if (editingMessage) {
      await handleUpdateMessage(editingMessage._id, data);
    } else {
      await handleCreateMessage(data);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white hover:bg-emerald-700"
      >
        + Tạo thông điệp mới
      </Button>

      <MessageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        initialData={editingMessage ? { title: editingMessage.title, content: editingMessage.content } : undefined}
        isLoading={isSubmitting}
        title={editingMessage ? "Sửa thông điệp" : "Tạo thông điệp"}
      />

      {messages.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-stone-500">Chưa có thông điệp nào</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card key={message._id} className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold text-stone-900 flex-1">
                      {message.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        message.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {message.isActive ? "Đang hiển thị" : "Ẩn"}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                    {message.content}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    {new Date(message.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                <Button
                  onClick={() => handleToggleActive(message)}
                  size="sm"
                  className="flex-1 bg-stone-100 text-stone-900 hover:bg-stone-200 flex items-center justify-center gap-2"
                >
                  {message.isActive ? (
                    <>
                      <EyeOff size={16} /> Ẩn
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> Hiển thị
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleEditMessage(message)}
                  size="sm"
                  className="flex-1 bg-blue-100 text-blue-900 hover:bg-blue-200 flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Sửa
                </Button>
                <Button
                  onClick={() => handleDeleteMessage(message._id)}
                  size="sm"
                  className="flex-1 bg-red-100 text-red-900 hover:bg-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Xoá
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
