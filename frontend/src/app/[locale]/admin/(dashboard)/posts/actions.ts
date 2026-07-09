"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { postSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function deletePost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const { error } = await supabase.from("daily_logs").delete().eq("id", id);
    if (error) {
      console.error("DB error in deletePost:", error.message);
      throw new Error("Failed to delete post.");
    }
  } catch (err: any) {
    console.error("Action error in deletePost:", err.message);
    throw new Error("Failed to delete post. Please try again later.");
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      mood: (formData.get("mood") as string) || null,
      slug:
        (formData.get("slug") as string) ||
        slugify(formData.get("title") as string),
      category: (formData.get("category") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      tags: (formData.get("tags") as string) || null,
      locale: (formData.get("locale") as string) || "en",
    };

    const validatedData = postSchema.parse(rawData);

    const post = {
      ...validatedData,
      tags: validatedData.tags
        ? validatedData.tags.split(",").map((t) => t.trim())
        : [],
      user_id: user.id,
    };

    let { error } = await supabase.from("daily_logs").insert(post);

    if (
      error &&
      error.message.includes("image_url") &&
      error.message.includes("schema cache")
    ) {
      const fallbackPost = { ...post };
      delete (fallbackPost as any).image_url;
      const retry = await supabase.from("daily_logs").insert(fallbackPost);
      error = retry.error;
    }

    if (error) {
      console.error("DB error in createPost:", error.message);
      throw new Error("Failed to create post.");
    }
  } catch (err: any) {
    console.error("Action error in createPost:", err.message);
    throw new Error("Failed to create post. Please try again later.");
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      mood: (formData.get("mood") as string) || null,
      slug:
        (formData.get("slug") as string) ||
        slugify(formData.get("title") as string),
      category: (formData.get("category") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      tags: (formData.get("tags") as string) || null,
      locale: (formData.get("locale") as string) || "en",
    };

    const validatedData = postSchema.parse(rawData);

    const post = {
      ...validatedData,
      tags: validatedData.tags
        ? validatedData.tags.split(",").map((t) => t.trim())
        : [],
    };

    let { error } = await supabase.from("daily_logs").update(post).eq("id", id);

    if (
      error &&
      error.message.includes("image_url") &&
      error.message.includes("schema cache")
    ) {
      const fallbackPost = { ...post };
      delete (fallbackPost as any).image_url;
      const retry = await supabase
        .from("daily_logs")
        .update(fallbackPost)
        .eq("id", id);
      error = retry.error;
    }

    if (error) {
      console.error("DB error in updatePost:", error.message);
      throw new Error("Failed to update post.");
    }
  } catch (err: any) {
    console.error("Action error in updatePost:", err.message);
    throw new Error("Failed to update post. Please try again later.");
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
}
