import { createClient } from "@/lib/supabase/server";
import {
  FileText,
  TrendingUp,
  Activity,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("daily_logs")
    .select("id, created_at, title")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching logs:", error);
  }

  const totalLogs = logs?.length || 0;
  const recentLogs = logs?.slice(0, 5) || [];

  // Simple stats for the chart (posts per day for last 7 days)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const countsByDay = last7Days.map((day) => {
    const count =
      logs?.filter((log) => log.created_at.startsWith(day)).length || 0;
    return { day, count };
  });

  const maxCount = Math.max(...countsByDay.map((d) => d.count), 1); // avoid div by 0

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">{t("dashboard")}</h1>
        <p className="text-muted-foreground text-lg">
          {t("dashboardSubtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-6 -top-6 h-32 w-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center justify-between z-10">
            <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">
              {t("totalPosts")}
            </h3>
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="z-10 mt-2">
            <p className="text-5xl font-bold tracking-tighter">{totalLogs}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute -right-6 -top-6 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex items-center justify-between z-10">
            <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">
              {t("status")}
            </h3>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="z-10 mt-2">
            <p className="text-4xl font-bold tracking-tight text-emerald-500">
              {t("active")}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute -right-6 -top-6 h-32 w-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center justify-between z-10">
            <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase">
              {t("lastUpdate")}
            </h3>
            <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="z-10 mt-2 flex items-center h-full">
            <p className="text-2xl font-bold tracking-tight truncate">
              {recentLogs.length > 0
                ? new Date(recentLogs[0].created_at).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  )
                : t("never")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              {t("activityChart")}
            </h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {t("last7Days")}
            </span>
          </div>
          <div className="flex-1 flex items-end gap-3 h-56 mt-4">
            {countsByDay.map((d) => (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-3 group"
              >
                <div className="w-full relative flex items-end justify-center h-full bg-secondary/30 rounded-2xl overflow-hidden hover:bg-secondary/50 transition-colors">
                  <div
                    className="w-full bg-primary rounded-2xl transition-all duration-1000 ease-out group-hover:bg-primary/80 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                    style={{
                      height: `${(d.count / maxCount) * 100}%`,
                      minHeight: d.count > 0 ? "24px" : "0",
                    }}
                  />
                  {d.count > 0 && (
                    <span className="absolute bottom-3 text-primary-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {new Date(d.day).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("recentPosts")}
            </h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col gap-1.5 truncate pr-4">
                    <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {log.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <FileText className="h-8 w-8 opacity-20" />
                <p className="text-sm">{t("noRecentActivity")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
