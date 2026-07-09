"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ratelimit } from "@/lib/rate-limit";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "en";
  const supabase = await createClient();

  try {
    // Attempt rate limit by email
    const { success } = await ratelimit.limit(email || "anonymous");
    if (!success) {
      return redirect(`/${locale}/admin/login?message=Too many attempts. Please try again later.`);
    }
  } catch (err) {
    console.error("Rate limit check failed (missing Redis vars?):", err);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(
      `/${locale}/admin/login?message=Could not authenticate user`,
    );
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/admin`);
}

export async function logout(formData: FormData) {
  const locale = (formData.get("locale") as string) || "en";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/admin/login`);
}
