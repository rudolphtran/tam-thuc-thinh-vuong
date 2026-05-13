import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function getOwnedPublicIdPrefix(userId: string) {
  return `tam-thuc-thinh-vuong/daily/${userId}-`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Không tìm thấy file ảnh" }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "File upload phải là ảnh" }, { status: 400 });
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 2MB" }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cloudinary = getCloudinary();

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `${getOwnedPublicIdPrefix(session.user.id)}${Date.now()}`,
          resource_type: "image",
          transformation: [
            { width: 1600, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Không thể tải ảnh lên, vui lòng thử lại" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const publicId = typeof body.publicId === "string" ? body.publicId.trim() : "";

    if (!publicId) {
      return NextResponse.json({ error: "Thiếu publicId" }, { status: 400 });
    }

    if (!publicId.startsWith(getOwnedPublicIdPrefix(session.user.id))) {
      return NextResponse.json({ error: "Không có quyền xoá ảnh này" }, { status: 403 });
    }

    const cloudinary = getCloudinary();
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Không thể xoá ảnh, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
