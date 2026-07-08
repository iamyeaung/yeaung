"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import {
  createPost,
  updatePost,
} from "@/app/[locale]/admin/(dashboard)/posts/actions";
import { useLocale } from "next-intl";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const IMAGE_MAP: Record<string, string> = {
  nextjs: "1555066931-4365d14bab8c",
  react: "1522881193437-013143c74c15",
  performance: "1551288049-bebda4e38f71",
  tailwindcss: "1555939594595-814fe04cb880",
  ui: "1561070791266-298379c65691",
  design: "1561070791266-298379c65691",
  supabase: "1518770660439-4636190af475",
  security: "1550751827-4bd374c3f58b",
  database: "1451187580459-43490279c0fa",
  postgres: "1451187580459-43490279c0fa",
  optimization: "1618477388954-7ea52b09a068",
  realtime: "1518770660439-4636190af475",
  hooks: "1498050108023-c5249f4df085",
};

const FALLBACK_IMAGES = [
  "1498050108023-c5249f4df085",
  "1518770660439-4636190af475",
  "1550751827-4bd374c3f58b",
  "1451187580459-43490279c0fa",
  "1555066931-4365d14bab8c",
];

// Lazy import for the markdown editor to avoid SSR issues
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

type PostFormProps = {
  initialData?: {
    id: string;
    title: string;
    content: string;
    mood: string | null;
    tags: string[] | null;
    slug?: string | null;
    category?: string | null;
    image_url?: string | null;
  };
  categories: { id: string; name: string; slug: string }[];
};

export function PostForm({ initialData, categories }: PostFormProps) {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(initialData?.content || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  let defaultImageId =
    FALLBACK_IMAGES[(initialData?.title?.length || 0) % FALLBACK_IMAGES.length];
  if (initialData?.tags && initialData.tags.length > 0) {
    for (const tag of initialData.tags) {
      const normalizedTag = tag.toLowerCase();
      if (IMAGE_MAP[normalizedTag]) {
        defaultImageId = IMAGE_MAP[normalizedTag];
        break;
      }
    }
  }
  const effectiveImageUrl =
    imageUrl ||
    `https://images.unsplash.com/photo-${defaultImageId}?w=800&q=80&auto=format`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const displayId = slug.trim()
    ? slug.trim()
    : initialData?.id || "new-post-id";
  const displayCategory = category.trim() ? `${category.trim()}/` : "";
  const previewUrl = `${baseUrl}/${displayCategory}${displayId}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Inject the markdown content and locale into formData
    formData.set("content", content);
    formData.set("locale", locale);

    try {
      if (initialData) {
        await updatePost(initialData.id, formData);
      } else {
        await createPost(formData);
      }
      router.push("/admin/posts");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col xl:flex-row gap-6 items-start animate-in fade-in duration-500"
    >
      {/* MAIN COLUMN (Left) */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
            {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold tracking-wide uppercase text-muted-foreground"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Enter post title"
              className="w-full rounded-md px-4 py-2 bg-background border border-border text-foreground font-medium text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div
            className="space-y-2"
            data-color-mode={
              mounted && resolvedTheme === "dark" ? "dark" : "light"
            }
          >
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Content (Markdown)
            </label>
            <div className="border border-border rounded-md overflow-hidden bg-background min-h-[600px]">
              {mounted ? (
                <Suspense
                  fallback={
                    <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  }
                >
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    height={600}
                    className="w-full !border-0 text-base"
                    textareaProps={{
                      placeholder: "Write your log here using Markdown...",
                    }}
                  />
                </Suspense>
              ) : (
                <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR COLUMN (Right) */}
      <div className="w-full xl:w-80 shrink-0 space-y-6">
        {/* Publish Block */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm border-b border-border pb-3 uppercase tracking-wider text-muted-foreground">
            Publish
          </h3>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center items-center bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {initialData ? "Save Changes" : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Settings Block */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-sm border-b border-border pb-3 uppercase tracking-wider text-muted-foreground">
            Settings
          </h3>

          <div className="space-y-3">
            <label htmlFor="image_url" className="text-sm font-medium">
              Thumbnail Image URL
            </label>
            <div className="w-full aspect-video rounded-md overflow-hidden bg-muted border border-border relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={effectiveImageUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
              {!imageUrl && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-sm">
                  Auto-generated
                </div>
              )}
            </div>
            <input
              id="image_url"
              name="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Custom URL (Slug)
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="e.g. my-custom-post"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <p className="text-xs text-muted-foreground break-all mt-1">
              Preview:{" "}
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {previewUrl}
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="mood" className="text-sm font-medium">
              Mood (Optional)
            </label>
            <input
              id="mood"
              name="mood"
              defaultValue={initialData?.mood || ""}
              placeholder="e.g. Happy, Productive"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={initialData?.tags?.join(", ") || ""}
              placeholder="coding, nextjs (comma separated)"
              className="w-full rounded-md px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
