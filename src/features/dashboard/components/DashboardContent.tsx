"use client";

import { MessagePopup } from "@/components/MessagePopup";

interface DashboardContentProps {
  children: React.ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <>
      <MessagePopup />
      {children}
    </>
  );
}
