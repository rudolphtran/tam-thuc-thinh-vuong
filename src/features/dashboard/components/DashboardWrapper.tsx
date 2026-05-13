"use client";

import { MessageBanner } from "@/components/MessageBanner";
import { MessagePopup } from "@/components/MessagePopup";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MessageBanner />
      <MessagePopup />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </>
  );
}
