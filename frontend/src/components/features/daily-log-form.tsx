"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { DailyLogMood } from "@/types/daily-log";
import { useLocale } from "next-intl";
import { Bold, Italic, Code, Link as LinkIcon, Table } from "lucide-react";

const MOOD_OPTIONS: { value: DailyLogMood; label: string; emoji: string }[] = [
  { value: "great", label: "Great", emoji: "🔥" },
  { value: "good", label: "Good", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "bad", label: "Bad", emoji: "😕" },
  { value: "terrible", label: "Terrible", emoji: "😞" },
];

export function DailyLogForm() {
  const locale = useLocale();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<DailyLogMood | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertMarkdown = (
    type: "bold" | "italic" | "code" | "link" | "table",
  ) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "code":
        replacement = `\`\`\`\n${selectedText || "code block"}\n\`\`\``;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        break;
      case "table":
        replacement = `\n| Header 1 | Header 2 |\n|---|---|\n| ${selectedText || "Cell 1"} | Cell 2 |\n`;
        break;
    }

    const newValue =
      text.substring(0, start) + replacement + text.substring(end);
    setContent(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await api.dailyLogs.create({
        title,
        content,
        mood: mood || undefined,
        locale,
      });
      setSuccess(true);
      setTitle("");
      setContent("");
      setMood("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you work on today?"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Content (Markdown textarea) */}
      <div>
        <label
          htmlFor="content"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notebook Entry{" "}
          <span className="text-gray-400 dark:text-gray-500">
            (Markdown supported)
          </span>
        </label>

        {/* Markdown Toolbar */}
        <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-700 border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-800/50 p-1.5">
          <button
            type="button"
            onClick={() => insertMarkdown("bold")}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("italic")}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("code")}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("link")}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("table")}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Table"
          >
            <Table className="h-4 w-4" />
          </button>
        </div>

        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`## What I did\n- Built the authentication flow\n- Fixed a bug in the dashboard\n\n## What I learned\n- How to use Laravel Sanctum\n\n## Tomorrow\n- Start the search feature`}
          required
          rows={16}
          className="w-full rounded-b-lg rounded-t-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Mood selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          How was your day? <span className="text-gray-400">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(mood === option.value ? "" : option.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                mood === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status messages */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✅ Notebook entry saved successfully!
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} size="lg">
          Save Notebook Entry
        </Button>
      </div>
    </form>
  );
}
