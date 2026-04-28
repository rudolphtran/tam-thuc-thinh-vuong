import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/features/dashboard/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar — desktop */}
      <header className="hidden md:flex gradient-prosperity text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✦</span>
            <span className="font-semibold text-sm tracking-tight">
              Tâm Thức Thịnh Vượng
            </span>
          </div>
          <DashboardNav userName={session.user?.name ?? ""} mode="top" />
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden gradient-prosperity text-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-green-400 text-base">✦</span>
            <span className="font-semibold text-sm">Tâm Thức Thịnh Vượng</span>
          </div>
          <span className="text-stone-300 text-xs">
            {session.user?.name?.split(" ").slice(-1)[0]}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </main>

      {/* Bottom nav — mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
        <DashboardNav userName={session.user?.name ?? ""} mode="bottom" />
      </div>
    </div>
  );
}
