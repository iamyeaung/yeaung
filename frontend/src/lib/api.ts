import { createClient } from "@supabase/supabase-js";
import type { DailyLog, CreateDailyLog } from "@/types/daily-log";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const supabase = createClient(supabaseUrl, supabaseKey);

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function mapToCamelCase(row: any): DailyLog {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood,
    tags: row.tags,
    slug: row.slug,
    category: row.category,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const api = {
  dailyLogs: {
    create: async (data: CreateDailyLog): Promise<{ data: DailyLog }> => {
      // Use a mock UUID for development if auth is not implemented yet
      const mockUserId = "00000000-0000-0000-0000-000000000000";

      const { data: row, error } = await supabase
        .from("daily_logs")
        .insert({
          title: data.title,
          content: data.content,
          mood: data.mood ?? null,
          tags: data.tags ?? null,
          user_id: mockUserId,
        })
        .select()
        .single();

      if (error) {
        throw new ApiError(500, error.message);
      }

      return { data: mapToCamelCase(row) };
    },

    list: async (): Promise<{ data: DailyLog[] }> => {
      const { data: rows, error } = await supabase
        .from("daily_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new ApiError(500, error.message);
      }

      return { data: (rows || []).map(mapToCamelCase) };
    },

    get: async (idOrSlug: string): Promise<{ data: DailyLog }> => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      
      let query = supabase.from("daily_logs").select("*");
      
      if (isUuid) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }
      
      const { data: row, error } = await query.single();

      if (error) {
        throw new ApiError(500, error.message);
      }

      return { data: mapToCamelCase(row) };
    },
  },
};

export { ApiError };
