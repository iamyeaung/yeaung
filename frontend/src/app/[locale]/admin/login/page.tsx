import { Link } from "@/i18n/routing";
import { login } from "./actions";
import { ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("Login");
  const tNav = await getTranslations("Navbar");

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center bg-background/95 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-full no-underline text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary flex items-center group text-sm font-medium transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {tNav("publicSite")}
      </Link>

      <div className="w-full max-w-md px-8 py-10 bg-card border border-border/50 rounded-3xl shadow-2xl backdrop-blur-sm z-10">
        <div className="flex flex-col items-center space-y-3 text-center mb-8">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <form className="flex flex-col gap-5 w-full" action={login}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password"
            >
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2 w-full mt-2 shadow-sm hover:shadow-md">
            {t("button")}
          </button>

          {resolvedSearchParams?.message && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive text-center text-sm rounded-xl border border-destructive/20 flex items-center justify-center gap-2">
              <p>{resolvedSearchParams.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
