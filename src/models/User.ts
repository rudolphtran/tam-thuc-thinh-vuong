import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  currentDayNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    currentDayNumber: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User = models.User ?? model<IUser>("User", UserSchema);
