"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Chào mừng trở lại</h1>
        <p className="text-stone-500 text-sm mb-7">Đăng nhập để tiếp tục hành trình của bạn</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-amber-600 font-medium hover:text-amber-700 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
