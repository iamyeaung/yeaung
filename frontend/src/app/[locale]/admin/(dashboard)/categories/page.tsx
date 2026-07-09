import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getTranslations } from "next-intl/server";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("Admin");
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("manageCategories")}
        </h1>
        <p className="text-muted-foreground">{t("manageCategoriesSubtitle")}</p>
      </div>

      <CategoryManager initialCategories={categories || []} />
    </div>
  );
}
