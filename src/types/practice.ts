export type DayType = "A" | "B" | "C" | "D" | "E";

export interface DailyEntryBase {
  // Bước chung
  affirmationRead: boolean;
  educationDeposit: number;
  investmentDeposit: number;
  successes: string[]; // ít nhất 5
  dailyImageUrl?: string;
  dailyImagePublicId?: string;

  // Loại ngày
  dayType: DayType;
  dayNumber: number;
}

// Dạng A: Tuyên bố giàu có + cảm xúc
export interface DayTypeAFields {
  customAffirmation: string;
  emotionDescription: string;
}

// Dạng B: Mục tiêu lớn + mục đích thịnh vượng
export interface DayTypeBFields {
  bigGoalVAKS: string;
  bigGoalDone: string;
  purposeList: string[]; // 5–10 mục đích
  chosenPurpose: string;
}

// Dạng C: Mục tiêu ngắn hạn + lý do xứng đáng
export interface DayTypeCFields {
  shortTermGoalVAKS: string;
  shortTermGoalDone: string;
  worthinessReasons: string[]; // 3 lý do
}

// Dạng D: Niềm tin hỗ trợ + giá trị bản thân
export interface DayTypeDFields {
  supportingBeliefVAKS: string;
  valueDescription: string;
}

// Dạng E: Lòng biết ơn + thiền
export interface DayTypeEFields {
  gratitudeList: string[]; // ít nhất 10
  chosenGratitude: string;
  meditationDone: boolean;
}

export type DayTypeFields =
  | DayTypeAFields
  | DayTypeBFields
  | DayTypeCFields
  | DayTypeDFields
  | DayTypeEFields;

export interface DailyEntry extends DailyEntryBase {
  _id: string;
  userId: string;
  completed: boolean;
  typeFields: DayTypeFields;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeProgress {
  currentDayNumber: number;
  currentDayType: DayType;
  totalCompleted: number;
  totalEducationDeposit: number;
  totalInvestmentDeposit: number;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
}
