import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ye Aung — Daily Log",
  description: "A Knowledge Management System for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
