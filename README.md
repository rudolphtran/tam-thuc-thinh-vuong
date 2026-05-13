# tam-thuc-thinh-vuong

## Orphan Image Cleanup (Cloudinary)

The app provides a maintenance endpoint to remove orphaned daily images that were uploaded but never attached to a completed entry.

- Endpoint: `GET /api/maintenance/cleanup-images` (or `POST`)
- Auth: send `Authorization: Bearer <CRON_SECRET>` (or `x-cron-secret`)
- Behavior: deletes Cloudinary images under `tam-thuc-thinh-vuong/daily/` that are not referenced in `DailyEntry.dailyImagePublicId` and older than `CLEANUP_IMAGE_ORPHAN_HOURS` (default 24h)

Recommended: configure an external scheduler (or Vercel Cron) to call this endpoint every day.

Vercel Cron is configured in `vercel.json` to run daily at `03:00 UTC`.