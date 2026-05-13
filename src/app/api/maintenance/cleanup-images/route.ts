import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCloudinary } from "@/lib/cloudinary";
import { DailyEntry } from "@/models/DailyEntry";

const DAILY_IMAGE_PREFIX = "tam-thuc-thinh-vuong/daily/";
const DEFAULT_ORPHAN_HOURS = 24;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const token = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace("Bearer ", "");
  return token === secret;
}

function getOrphanCutoffDate() {
  const configuredHours = Number(process.env.CLEANUP_IMAGE_ORPHAN_HOURS ?? DEFAULT_ORPHAN_HOURS);
  const hours = Number.isFinite(configuredHours) && configuredHours > 0 ? configuredHours : DEFAULT_ORPHAN_HOURS;
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function cleanupOrphanImages(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const cloudinary = getCloudinary();
    const usedPublicIds = new Set(
      await DailyEntry.distinct("dailyImagePublicId", {
        dailyImagePublicId: { $ne: "" },
      })
    );

    const cutoffDate = getOrphanCutoffDate();
    let nextCursor: string | undefined;
    let scanned = 0;
    const orphanPublicIds: string[] = [];

    do {
      const response = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        prefix: DAILY_IMAGE_PREFIX,
        max_results: 100,
        next_cursor: nextCursor,
      });

      for (const resource of response.resources ?? []) {
        scanned += 1;
        const publicId = String(resource.public_id ?? "");
        const createdAt = resource.created_at ? new Date(resource.created_at) : new Date();
        const isOlderThanCutoff = createdAt < cutoffDate;

        if (publicId && !usedPublicIds.has(publicId) && isOlderThanCutoff) {
          orphanPublicIds.push(publicId);
        }
      }

      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (orphanPublicIds.length > 0) {
      await cloudinary.api.delete_resources(orphanPublicIds, {
        resource_type: "image",
        type: "upload",
        invalidate: true,
      });
    }

    return NextResponse.json({
      ok: true,
      scanned,
      deleted: orphanPublicIds.length,
      cutoffDate: cutoffDate.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return cleanupOrphanImages(request);
}

export async function GET(request: Request) {
  return cleanupOrphanImages(request);
}
