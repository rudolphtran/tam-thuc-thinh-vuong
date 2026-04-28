import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tâm Thức Thịnh Vượng",
  description:
    "Hành trình thực hành tâm thức thịnh vượng mỗi ngày — xây dựng tư duy giàu có từ bên trong.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-stone-50 text-stone-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
