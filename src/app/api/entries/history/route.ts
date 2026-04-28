import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { DailyEntry } from "@/models/DailyEntry";

// GET /api/entries/history — lấy tất cả entries đã hoàn thành
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const dayType = searchParams.get("dayType");
  const skip = (page - 1) * limit;

  await connectDB();

  const filter: Record<string, unknown> = {
    userId: session.user.id,
    completed: true,
  };
  if (dayType && ["A", "B", "C", "D", "E"].includes(dayType)) {
    filter.dayType = dayType;
  }

  const [entries, total] = await Promise.all([
    DailyEntry.find(filter)
      .sort({ dayNumber: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    DailyEntry.countDocuments(filter),
  ]);

  return NextResponse.json({ entries, total, page, limit });
}
