"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Đăng ký thất bại");
        return;
      }

      // Auto login sau khi đăng ký thành công
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Tạo tài khoản</h1>
        <p className="text-stone-500 text-sm mb-7">
          Bắt đầu hành trình thịnh vượng của bạn ngay hôm nay
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên của bạn"
            type="text"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="ban@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Ít nhất 8 ký tự"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
            autoComplete="new-password"
            hint="Tối thiểu 8 ký tự"
          />
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Tạo tài khoản
          </Button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
