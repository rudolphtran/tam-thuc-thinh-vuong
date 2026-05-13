import { Schema, model, models, type Document, type Types } from "mongoose";
import type { DayType } from "@/types/practice";

export interface IDailyEntry extends Document {
  userId: Types.ObjectId;
  dayNumber: number;
  dayType: DayType;
  completed: boolean;
  dailyImageUrl: string;
  dailyImagePublicId: string;
  // Bước chung
  affirmationRead: boolean;
  educationDeposit: number;
  investmentDeposit: number;
  successes: string[];
  // Trường động theo dạng ngày — lưu linh hoạt bằng Map
  typeFields: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const DailyEntrySchema = new Schema<IDailyEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dayNumber: { type: Number, required: true, min: 1 },
    dayType: { type: String, enum: ["A", "B", "C", "D", "E"], required: true },
    completed: { type: Boolean, default: false },
    dailyImageUrl: { type: String, default: "" },
    dailyImagePublicId: { type: String, default: "" },
    affirmationRead: { type: Boolean, default: false },
    educationDeposit: { type: Number, default: 0, min: 0 },
    investmentDeposit: { type: Number, default: 0, min: 0 },
    successes: { type: [String], default: [] },
    typeFields: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

DailyEntrySchema.index({ userId: 1, dayNumber: 1 }, { unique: true });
DailyEntrySchema.index({ userId: 1, completed: 1 });

export const DailyEntry =
  models.DailyEntry ?? model<IDailyEntry>("DailyEntry", DailyEntrySchema);
