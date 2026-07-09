import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/^\d+[\.\-\s]+/, '') // Remove leading numbers like "9. "
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-\u0E00-\u0E7F\u1000-\u109F]+/g, '') // Keep alphanumeric, Thai, and Myanmar chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .split('-').slice(0, 8).join('-') // Limit to ~8 words for a short meaningful URL
    .replace(/-+$/, '');         // Remove trailing hyphen
}
