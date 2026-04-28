import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DailyEntry } from "@/models/DailyEntry";
import { getDayType } from "@/lib/day-cycle";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  await connectDB();
  const [user, stats] = await Promise.all([
    User.findById(session.user.id),
    DailyEntry.aggregate([
      { $match: { userId: session.user.id, completed: true } },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: 1 },
          totalEducation: { $sum: "$educationDeposit" },
          totalInvestment: { $sum: "$investmentDeposit" },
        },
      },
    ]),
  ]);

  if (!user) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  const agg = stats[0] ?? {
    totalCompleted: 0,
    totalEducation: 0,
    totalInvestment: 0,
  };

  return NextResponse.json({
    currentDayNumber: user.currentDayNumber,
    currentDayType: getDayType(user.currentDayNumber),
    totalCompleted: agg.totalCompleted,
    totalEducationDeposit: agg.totalEducation,
    totalInvestmentDeposit: agg.totalInvestment,
    userName: user.name,
  });
}
