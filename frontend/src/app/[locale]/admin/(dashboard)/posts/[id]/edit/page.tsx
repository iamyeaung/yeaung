import { PostForm } from "@/components/admin/PostForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  let { data: post, error } = await supabase
    .from("daily_logs")
    .select("id, title, content, mood, tags, slug, category, image_url")
    .eq("id", id)
    .single();

  // Fallback if 'slug' or 'category' column doesn't exist yet
  if (error) {
    let fallback = await supabase
      .from("daily_logs")
      .select("id, title, content, mood, tags, image_url")
      .eq("id", id)
      .single();

    if (fallback.error) {
      fallback = await supabase
        .from("daily_logs")
        .select("id, title, content, mood, tags")
        .eq("id", id)
        .single();
    }

    post = fallback.data as any;
  }

  if (!post) {
    notFound();
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Post</h1>
        <p className="text-muted-foreground">
          Make changes to your notebook entry.
        </p>
      </div>

      <PostForm initialData={post} categories={categories || []} />
    </div>
  );
}
