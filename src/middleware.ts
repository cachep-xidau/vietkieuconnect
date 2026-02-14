import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run intl middleware first — sets locale headers for getTranslations()
  const response = intlMiddleware(request);

  // Create Supabase client that sets cookies on the intl response (not a new one)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Detect locale from URL for redirects
  const locale = pathname.startsWith("/vi") ? "vi" : "en";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot-password");
  const isAdminPage = pathname.includes("/admin");
  const isProtectedPage =
    !isAdminPage &&
    (pathname.includes("/profile") ||
      pathname.includes("/bookings") ||
      pathname.includes("/dashboard") ||
      pathname.includes("/consultation") ||
      pathname.includes("/consultations") ||
      pathname.includes("/reviews"));

  // Handle admin pages first
  if (isAdminPage) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const userRole = profile?.role;

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Handle regular protected pages
  if (isProtectedPage && !user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
