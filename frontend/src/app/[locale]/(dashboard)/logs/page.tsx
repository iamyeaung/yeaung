import { DailyLogForm } from "@/components/features/daily-log-form";

export default function DailyLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Daily Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Document what you did, what you learned, and what&apos;s next.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <DailyLogForm />
      </div>
    </div>
  );
}
