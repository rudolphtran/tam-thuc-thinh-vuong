import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { registerSchema } from "@/validation/auth";

function toDebugPayload(err: unknown) {
  const error = err as { name?: string; message?: string; code?: string | number };
  return {
    name: error?.name ?? "UnknownError",
    message: error?.message ?? "Unknown error",
    code: error?.code ?? null,
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    nodeEnv: process.env.NODE_ENV,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });

    return NextResponse.json(
      { message: "Đăng ký thành công", userId: user._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    const debug = toDebugPayload(err);
    console.error("Register error", debug);
    return NextResponse.json(
      {
        error: "Lỗi hệ thống, vui lòng thử lại",
        debug,
      },
      { status: 500 }
    );
  }
}
