"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "mm" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="flex h-10 px-4 items-center justify-center rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none gap-1.5"
    >
      {locale === "en" ? (
        <>
          <span>🇲🇲</span>
          <span>မြန်မာ</span>
        </>
      ) : (
        <>
          <span>🇬🇧</span>
          <span>English</span>
        </>
      )}
    </button>
  );
}
