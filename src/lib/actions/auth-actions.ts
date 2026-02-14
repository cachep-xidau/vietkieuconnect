"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import type { ActionResult } from "@/types/actions";
import type {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/lib/validators/auth";

export async function signIn(data: LoginInput): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  redirect("/dashboard");
}

export async function signUp(
  data: RegisterInput
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  redirect("/dashboard");
}

export async function signInWithGoogle(): Promise<
  ActionResult<{ url: string }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  return {
    success: true,
    data: { url: data.url },
  };
}

export async function signOut(): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  redirect("/");
}

export async function resetPassword(
  data: ResetPasswordInput
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${getSiteUrl()}/auth/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  return {
    success: true,
    data: null,
  };
}
