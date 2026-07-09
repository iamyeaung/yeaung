"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/routing";
import { X, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  categories: string[];
};

export function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuContent = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F9F8F4] dark:bg-gray-950 p-6 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5722] to-orange-400 text-white text-lg font-black shadow-lg shadow-orange-500/30">
            Y
          </div>
          <span className="font-sans text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Ye Aung<span className="text-[#FF5722]">.</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-lg font-bold"
        >
          {t("all")}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/#feed`}
            onClick={() => setIsOpen(false)}
            className="px-5 py-4 rounded-xl text-lg font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all capitalize"
          >
            {cat}
          </Link>
        ))}
        <a
          href="https://github.com/iamyeaung"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center h-14 rounded-xl bg-gray-900 dark:bg-gray-100 text-lg font-bold text-white dark:text-gray-900 shadow-md"
        >
          {t("github")}
        </a>
      </nav>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#FF5722] dark:hover:text-[#FF5722]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && mounted && createPortal(menuContent, document.body)}
    </>
  );
}
