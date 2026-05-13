import { Schema, model, models, type Document } from "mongoose";

export interface IMessage extends Document {
  title: string;
  content: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    isActive: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MessageSchema.index({ isActive: 1, order: 1 });

export const Message = models.Message ?? model<IMessage>("Message", MessageSchema);
