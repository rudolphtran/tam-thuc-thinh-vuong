import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(messages);
  } catch (error) {
    console.error("GET /api/messages/manage error:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
