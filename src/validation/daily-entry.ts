import { z } from "zod";

const baseSchema = z.object({
  affirmationRead: z.boolean(),
  educationDeposit: z.number().min(0),
  investmentDeposit: z.number().min(0),
  successes: z
    .array(z.string().min(1))
    .min(5, "Hãy liệt kê ít nhất 5 thành công"),
});

export const dayTypeASchema = baseSchema.extend({
  customAffirmation: z.string().min(10, "Hãy viết tuyên bố của bạn"),
  emotionDescription: z.string().min(5, "Hãy mô tả cảm xúc của bạn"),
});

export const dayTypeBSchema = baseSchema.extend({
  bigGoalVAKS: z.string().min(5, "Hãy mô tả mục tiêu lớn VAKS"),
  bigGoalDone: z.string().min(5, "Hãy thực hiện pháp Done"),
  purposeList: z
    .array(z.string().min(1))
    .min(5, "Hãy liệt kê ít nhất 5 mục đích"),
  chosenPurpose: z.string().min(10, "Hãy giải thích mục đích đã chọn"),
});

export const dayTypeCSchema = baseSchema.extend({
  shortTermGoalVAKS: z.string().min(5, "Hãy mô tả mục tiêu ngắn hạn VAKS"),
  shortTermGoalDone: z.string().min(5, "Hãy thực hiện pháp Done"),
  worthinessReasons: z
    .array(z.string().min(1))
    .min(3, "Hãy liệt kê 3 lý do"),
});

export const dayTypeDSchema = baseSchema.extend({
  supportingBeliefVAKS: z.string().min(5, "Hãy mô tả niềm tin hỗ trợ VAKS"),
  valueDescription: z.string().min(10, "Hãy mô tả giá trị bạn tạo ra"),
});

export const dayTypeESchema = baseSchema.extend({
  gratitudeList: z
    .array(z.string().min(1))
    .min(10, "Hãy liệt kê ít nhất 10 điều biết ơn"),
  chosenGratitude: z.string().min(10, "Hãy giải thích điều bạn biết ơn nhất"),
  meditationDone: z.boolean(),
});

export type DayTypeAInput = z.infer<typeof dayTypeASchema>;
export type DayTypeBInput = z.infer<typeof dayTypeBSchema>;
export type DayTypeCInput = z.infer<typeof dayTypeCSchema>;
export type DayTypeDInput = z.infer<typeof dayTypeDSchema>;
export type DayTypeEInput = z.infer<typeof dayTypeESchema>;
