import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { validateRedirect } from "@/lib/auth/validate-redirect";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  const timestamp = new Date().toISOString();

  // Handle OAuth errors (user denied consent, provider errors, etc.)
  if (error) {
    console.error(
      `[${timestamp}] [OAuth Error] ${error}:`,
      errorDescription || "No description provided"
    );

    return NextResponse.redirect(
      `${origin}/en/auth/login?error=${encodeURIComponent(error)}`
    );
  }

  // Handle missing authorization code
  if (!code) {
    console.error(
      `[${timestamp}] [OAuth Error] Missing authorization code in callback`
    );

    return NextResponse.redirect(
      `${origin}/en/auth/login?error=missing_code`
    );
  }

  try {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error(
        `[${timestamp}] [Session Exchange Error]`,
        exchangeError.message
      );

      return NextResponse.redirect(
        `${origin}/en/auth/login?error=session_exchange_failed`
      );
    }

    // Ensure profile exists (defense against race condition)
    const profileResult = await ensureProfile();

    if (!profileResult.success) {
      console.error(
        `[${timestamp}] [Profile Creation Error]`,
        profileResult.error || "Unknown error"
      );

      // Session exists but profile failed - log warning but allow redirect
      // User can still access the app, profile will be retried on next login
      console.warn(
        `[${timestamp}] [Warning] User ${data.user?.id} logged in without profile`
      );
    }

    // Validate redirect URL to prevent open redirect vulnerability
    const { safePath } = validateRedirect(next, origin);

    console.log(
      `[${timestamp}] [OAuth Success] User ${data.user?.id} authenticated, redirecting to ${safePath}`
    );

    return NextResponse.redirect(`${origin}${safePath}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    console.error(
      `[${timestamp}] [Callback Handler Error]`,
      errorMsg
    );

    return NextResponse.redirect(
      `${origin}/en/auth/login?error=callback_error`
    );
  }
}
