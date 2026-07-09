"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  ArrowLeft,
  Tags,
  ShieldCheck,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/[locale]/admin/login/actions";
import { useTranslations, useLocale } from "next-intl";

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

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuContent = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background p-6 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center mb-8 border-b border-border/40 pb-4">
        <Link
          href="/admin"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 font-bold tracking-tight text-xl group"
        >
          <div className="bg-primary/10 text-primary rounded-xl p-2 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          Ye Aung
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 bg-muted/50 rounded-full text-muted-foreground"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2">
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
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-300",
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

      <div className="pt-4 border-t border-border/40 flex flex-col gap-3 mt-auto">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center w-full px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-2xl transition-colors"
        >
          <ArrowLeft className="mr-3 h-5 w-5" />
          {t("publicSite")}
        </Link>
        <form action={logout}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full px-4 py-4 text-base font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t("signOut")}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-muted/50 border border-border text-foreground shadow-sm transition-colors hover:bg-muted hover:text-primary"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && mounted && createPortal(menuContent, document.body)}
    </>
  );
}
