"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Sparkles, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/today", label: "Hôm nay", icon: Sparkles },
  { href: "/journal", label: "Nhật ký", icon: BookOpen },
  { href: "/messages", label: "Thông điệp", icon: MessageSquare },
];

interface DashboardNavProps {
  mode: "top" | "bottom";
}

export function DashboardNav({ mode }: DashboardNavProps) {
  const pathname = usePathname();

  if (mode === "top") {
    return (
      <nav className="flex items-center gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-white/20 text-white"
                  : "text-stone-300 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </span>
          </Link>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-stone-400 hover:text-white hover:bg-white/10 ml-2"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </nav>
    );
  }

  // Bottom navigation for mobile
  return (
    <nav className="bg-white border-t border-stone-200 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-[64px]",
                active ? "text-[#006400]" : "text-stone-400 hover:text-stone-700"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "fill-green-100")} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-[#006400] -mt-0.5" />
              )}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-stone-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Thoát</span>
        </button>
      </div>
    </nav>
  );
}
