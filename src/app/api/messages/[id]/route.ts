import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const message = await Message.findById(id);

    if (!message) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json(message);
  } catch (error) {
    console.error("GET /api/messages/[id] error:", error);
    return Response.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const data = await req.json();

    const message = await Message.findByIdAndUpdate(
      id,
      {
        title: data.title,
        content: data.content,
      },
      { returnDocument: "after" }
    );

    if (!message) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json(message);
  } catch (error) {
    console.error("PUT /api/messages/[id] error:", error);
    return Response.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/messages/[id] error:", error);
    return Response.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const data = await req.json();

    const message = await Message.findByIdAndUpdate(
      id,
      {
        isActive: data.isActive,
        order: data.order ?? 0,
      },
      { returnDocument: "after" }
    );

    if (!message) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json(message);
  } catch (error) {
    console.error("PATCH /api/messages/[id] error:", error);
    return Response.json(
      { error: "Failed to update message status" },
      { status: 500 }
    );
  }
}
