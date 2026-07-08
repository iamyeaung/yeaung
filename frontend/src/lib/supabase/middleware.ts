import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  response?: NextResponse,
) {
  let supabaseResponse =
    response ||
    NextResponse.next({
      request,
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = response
            ? response
            : NextResponse.next({
                request,
              });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh the session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    /^\/(en|mm)\/admin/.test(pathname) || pathname.startsWith("/admin");
  const isAdminLoginRoute =
    /^\/(en|mm)\/admin\/login/.test(pathname) || pathname === "/admin/login";

  // Protect the /admin routes
  if (isAdminRoute && !isAdminLoginRoute) {
    const localeMatch = pathname.match(/^\/(en|mm)/);
    const locale = localeMatch ? localeMatch[1] : "en";

    if (!user) {
      // no user, redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    // Admin Authorization Check
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      // User is logged in but is NOT the admin.
      // Sign them out and redirect to login with an error message.
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      url.searchParams.set(
        "message",
        "Unauthorized: You do not have admin access.",
      );
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
