import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DailyEntry } from "@/models/DailyEntry";
import { getDayType } from "@/lib/day-cycle";

// GET /api/entries — lấy entry ngày hiện tại
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  const entry = await DailyEntry.findOne({
    userId: user._id,
    dayNumber: user.currentDayNumber,
  });

  return NextResponse.json({
    dayNumber: user.currentDayNumber,
    dayType: getDayType(user.currentDayNumber),
    entry: entry ?? null,
  });
}

// POST /api/entries — tạo hoặc cập nhật entry và đánh dấu complete
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const dayNumber = user.currentDayNumber;
    const dayType = getDayType(dayNumber);

    // Upsert entry
    const entry = await DailyEntry.findOneAndUpdate(
      { userId: user._id, dayNumber },
      {
        $set: {
          userId: user._id,
          dayNumber,
          dayType,
          completed: true,
          affirmationRead: body.affirmationRead ?? true,
          educationDeposit: body.educationDeposit ?? 0,
          investmentDeposit: body.investmentDeposit ?? 0,
          successes: body.successes ?? [],
          typeFields: body.typeFields ?? {},
        },
      },
      { upsert: true, new: true }
    );

    // Tăng ngày sau khi hoàn thành
    await User.findByIdAndUpdate(user._id, {
      $inc: { currentDayNumber: 1 },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Lỗi hệ thống, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
