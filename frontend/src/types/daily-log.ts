export type DailyLogMood = "great" | "good" | "okay" | "bad" | "terrible";

export interface DailyLog {
  id: string;
  title: string;
  content: string;
  mood: DailyLogMood | null;
  tags: string[] | null;
  slug?: string | null;
  category?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  image_url?: string | null;
  locale: string;
}

export interface CreateDailyLog {
  title: string;
  content: string;
  mood?: DailyLogMood;
  tags?: string[];
  locale?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
