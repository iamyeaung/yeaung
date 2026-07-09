"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validations";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    };
    
    const validatedData = categorySchema.parse(rawData);

    const { error } = await supabase.from("categories").insert(validatedData);

    if (error) {
      console.error("DB error in createCategory:", error.message);
      throw new Error("Failed to create category.");
    }
  } catch (err: any) {
    console.error("Action error in createCategory:", err.message);
    throw new Error("Failed to create category. Please try again later.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts/create");
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    };
    
    const validatedData = categorySchema.parse(rawData);

    const { error } = await supabase
      .from("categories")
      .update(validatedData)
      .eq("id", id);

    if (error) {
      console.error("DB error in updateCategory:", error.message);
      throw new Error("Failed to update category.");
    }
  } catch (err: any) {
    console.error("Action error in updateCategory:", err.message);
    throw new Error("Failed to update category. Please try again later.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts/create");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("DB error in deleteCategory:", error.message);
      throw new Error("Failed to delete category.");
    }
  } catch (err: any) {
    console.error("Action error in deleteCategory:", err.message);
    throw new Error("Failed to delete category. Please try again later.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts/create");
}
