import type { DailyLog, CreateDailyLog } from "@/types/daily-log";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

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

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      message: res.statusText,
    }));
    throw new ApiError(res.status, body.message, body.errors);
  }

  return res.json();
}

export const api = {
  dailyLogs: {
    create: (data: CreateDailyLog) =>
      fetchApi<{ data: DailyLog }>("/daily-logs", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    list: () =>
      fetchApi<{ data: DailyLog[] }>("/daily-logs"),

    get: (id: string) =>
      fetchApi<{ data: DailyLog }>(`/daily-logs/${id}`),
  },
};

export { ApiError };
