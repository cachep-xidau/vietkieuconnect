"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { checkAdminRole } from "@/lib/auth/admin-auth-helper";

/**
 * Unflag a review (admin only - approve review)
 */
export async function unflagReview(
  reviewId: string
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    await checkAdminRole();
    const supabase = await createClient();

    const { error: updateError } = await (supabase
      .from("reviews")
      .update({
        flagged: false,
        flagged_at: null,
        flagged_by: null,
        flag_reason: null,
      })
      .eq("id", reviewId) as any);

    if (updateError) {
      console.error("Unflag review error:", updateError);
      return { success: false, error: "Failed to unflag review" };
    }

    return { success: true, data: { reviewId } };
  } catch (error) {
    console.error("Unflag review error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Delete a review (admin only - hard delete)
 */
export async function deleteReview(
  reviewId: string
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    await checkAdminRole();
    const supabase = await createClient();

    // Get clinic_id before deletion for rating update
    const { data: review } = await supabase
      .from("reviews")
      .select("clinic_id")
      .eq("id", reviewId)
      .single();

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Delete review (trigger will auto-update clinic rating)
    const { error: deleteError } = await (supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId) as any);

    if (deleteError) {
      console.error("Delete review error:", deleteError);
      return { success: false, error: "Failed to delete review" };
    }

    return { success: true, data: { reviewId } };
  } catch (error) {
    console.error("Delete review error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Bulk delete reviews (admin only)
 */
export async function bulkDeleteReviews(
  reviewIds: string[]
): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    await checkAdminRole();
    const supabase = await createClient();

    if (reviewIds.length === 0) {
      return { success: false, error: "No reviews selected" };
    }

    // Delete reviews (trigger will auto-update clinic ratings)
    const { error: deleteError } = await ((supabase
      .from("reviews")
      .delete() as any)
      .in("id", reviewIds));

    if (deleteError) {
      console.error("Bulk delete reviews error:", deleteError);
      return { success: false, error: "Failed to delete reviews" };
    }

    return { success: true, data: { deletedCount: reviewIds.length } };
  } catch (error) {
    console.error("Bulk delete reviews error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
