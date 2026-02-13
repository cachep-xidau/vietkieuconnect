import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split(";").reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            if (name && value) {
              acc.push({ name, value });
            }
            return acc;
          }, [] as Array<{ name: string; value: string }>);
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${value}; path=${options?.path ?? "/"}; ${options?.maxAge ? `max-age=${options.maxAge}` : ""}`;
          });
        },
      },
    }
  );
}
