export type DailyLogMood = "great" | "good" | "okay" | "bad" | "terrible";

export interface DailyLog {
  id: string;
  title: string;
  content: string;
  mood: DailyLogMood | null;
  tags: string[] | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyLog {
  title: string;
  content: string;
  mood?: DailyLogMood;
  tags?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
