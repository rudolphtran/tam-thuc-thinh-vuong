import { MessagesManager } from "@/features/messages/components/MessagesManager";

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Quản lý thông điệp</h1>
        <p className="text-stone-600 text-sm mt-1">
          Tạo, chỉnh sửa và quản lý các thông điệp sẽ hiển thị cho người dùng
        </p>
      </div>

      <MessagesManager />
    </div>
  );
}
