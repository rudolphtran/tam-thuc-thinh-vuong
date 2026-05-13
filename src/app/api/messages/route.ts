import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const messages = await Message.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return Response.json(messages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const message = new Message({
      title: data.title,
      content: data.content,
      isActive: false,
      order: 0,
    });

    await message.save();
    return Response.json(message, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return Response.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
