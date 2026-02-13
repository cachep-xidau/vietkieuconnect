"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { ReviewTable } from "@/types/database-clinic-tables";
import { reviewSubmissionSchema, ReviewSubmissionInput } from "@/lib/validators/review";

/**
 * Submit a review for a completed booking
 * Uploads photos to Supabase storage and creates review record
 */
export async function submitReview(
  bookingId: string,
  formData: FormData
): Promise<ActionResult<{ reviewId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    // Parse and validate form data
    const reviewData: ReviewSubmissionInput = {
      rating: parseInt(formData.get("rating") as string),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      treatmentType: (formData.get("treatmentType") as string) || undefined,
      photos: [],
    };

    const validation = reviewSubmissionSchema.safeParse(reviewData);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    // Fetch booking and verify ownership and status
    const { data: booking, error: bookingError } = await (supabase
      .from("bookings")
      .select("id, user_id, clinic_id, status")
      .eq("id", bookingId)
      .single() as any);

    if (bookingError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.user_id !== user.id) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    if (booking.status !== "completed") {
      return { success: false, error: "Only completed bookings can be reviewed" };
    }

    // Check if review already exists for this booking
    const { data: existingReview } = await (supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", bookingId)
      .single() as any);

    if (existingReview) {
      return { success: false, error: "Review already submitted for this booking" };
    }

    // Upload photos to storage
    const photoUrls: string[] = [];
    const photoFiles = formData.getAll("photos") as File[];

    if (photoFiles.length > 0) {
      for (const file of photoFiles) {
        if (file.size === 0) continue; // Skip empty files

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${bookingId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          return { success: false, error: "Failed to upload photo" };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("review-photos")
          .getPublicUrl(uploadData.path);

        photoUrls.push(publicUrl);
      }
    }

    // Insert review with status "approved" (auto-verified from completed bookings)
    const reviewInsert: ReviewTable["Insert"] = {
      user_id: user.id,
      clinic_id: booking.clinic_id,
      booking_id: bookingId,
      rating: validation.data.rating,
      title: validation.data.title,
      content: validation.data.content,
      treatment_type: validation.data.treatmentType || null,
      photos: photoUrls,
      status: "approved", // Auto-approve reviews from verified bookings
    };

    const { data: review, error: reviewError } = await (supabase
      .from("reviews")
      .insert(reviewInsert)
      .select("id")
      .single() as any);

    if (reviewError) {
      console.error("Review insert error:", reviewError);
      return { success: false, error: "Failed to submit review" };
    }

    // Update clinic rating and review count
    await updateClinicRating(booking.clinic_id);

    return { success: true, data: { reviewId: review.id } };
  } catch (error) {
    console.error("Submit review error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get review by booking ID
 * Returns null if no review exists
 */
export async function getReviewByBookingId(
  bookingId: string
): Promise<ActionResult<ReviewTable["Row"] | null>> {
  try {
    const supabase = await createClient();

    const { data: review, error } = await (supabase
      .from("reviews")
      .select("*")
      .eq("booking_id", bookingId)
      .single() as any);

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return { success: true, data: null };
      }
      console.error("Get review error:", error);
      return { success: false, error: "Failed to fetch review" };
    }

    return { success: true, data: review };
  } catch (error) {
    console.error("Get review by booking ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update clinic rating and review count based on all approved reviews
 * Called after new review submission
 */
async function updateClinicRating(clinicId: string): Promise<void> {
  const supabase = await createClient();

  // Calculate average rating from all approved reviews
  const { data: reviews } = await (supabase
    .from("reviews")
    .select("rating")
    .eq("clinic_id", clinicId)
    .eq("status", "approved") as any);

  // Handle edge case: 0 reviews
  if (!reviews || reviews.length === 0) {
    await (supabase
      .from("clinics")
      .update({
        rating: 0,
        review_count: 0,
      })
      .eq("id", clinicId) as any);
    return;
  }

  const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
  const roundedRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal

  await (supabase
    .from("clinics")
    .update({
      rating: roundedRating,
      review_count: reviews.length,
    })
    .eq("id", clinicId) as any);
}
