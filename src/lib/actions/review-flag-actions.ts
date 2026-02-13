"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

/**
 * Flag a review (user action - any authenticated user)
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    // Check if review exists
    const { data: review, error: reviewError } = await (supabase
      .from("reviews")
      .select("id, user_id, flagged")
      .eq("id", reviewId)
      .single() as any);

    if (reviewError || !review) {
      return { success: false, error: "Review not found" };
    }

    // Users cannot flag their own reviews
    if (review.user_id === user.id) {
      return { success: false, error: "Cannot flag your own review" };
    }

    // Check if already flagged
    if (review.flagged) {
      return { success: false, error: "Review already flagged" };
    }

    // Update review to flagged
    const { error: updateError } = await (supabase
      .from("reviews")
      .update({
        flagged: true,
        flagged_at: new Date().toISOString(),
        flagged_by: user.id,
        flag_reason: reason,
      })
      .eq("id", reviewId) as any);

    if (updateError) {
      console.error("Flag review error:", updateError);
      return { success: false, error: "Failed to flag review" };
    }

    return { success: true, data: { reviewId } };
  } catch (error) {
    console.error("Flag review error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
