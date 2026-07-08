"use client";

import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  ArrowLeft,
  Tags,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/[locale]/admin/login/actions";
import { useTranslations } from "next-intl";

const navigation = [
  {
    name: "Overview",
    translationKey: "dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Posts",
    translationKey: "posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    name: "Categories",
    translationKey: "categories",
    href: "/admin/categories",
    icon: Tags,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  return (
    <div className="flex h-full w-64 flex-col bg-card/80 backdrop-blur-2xl border-r border-border/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex h-20 items-center px-8 border-b border-border/40">
        <Link
          href="/admin"
          className="flex items-center gap-3 font-bold tracking-tight text-xl group"
        >
          <div className="bg-primary/10 text-primary rounded-xl p-2 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          Ye Aung
        </Link>
      </div>

      <div className="flex-1 flex flex-col py-8 px-4 gap-2">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-4">
          {t("mainMenu")}
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-110",
                )}
                aria-hidden="true"
              />
              {t(item.translationKey)}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/40 flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-2xl transition-colors"
        >
          <ArrowLeft className="mr-3 h-5 w-5" />
          {t("publicSite")}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t("signOut")}
          </button>
        </form>
      </div>
    </div>
  );
}
