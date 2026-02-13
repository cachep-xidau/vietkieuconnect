"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { BookingTable, TreatmentPlanTable } from "@/types/database-booking-tables";
import { ClinicTable } from "@/types/database-clinic-tables";

export async function acceptTreatmentPlan(
  treatmentPlanId: string
): Promise<ActionResult<{ bookingId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    // Fetch treatment plan
    const { data: treatmentPlan, error: planError } = await (supabase
      .from("treatment_plans")
      .select("*")
      .eq("id", treatmentPlanId)
      .single() as any);

    if (planError || !treatmentPlan) {
      return { success: false, error: "Treatment plan not found" };
    }

    // Verify user owns the consultation
    const { data: consultation } = await (supabase
      .from("consultation_requests")
      .select("user_id")
      .eq("id", treatmentPlan.consultation_id)
      .single() as any);

    if (!consultation || consultation.user_id !== user.id) {
      return { success: false, error: "Unauthorized", code: "FORBIDDEN" };
    }

    // Update treatment plan status
    const { error: updateError } = await (supabase
      .from("treatment_plans")
      .update({ status: "accepted" })
      .eq("id", treatmentPlanId) as any);

    if (updateError) {
      console.error("Treatment plan update error:", updateError);
      return { success: false, error: "Failed to accept treatment plan" };
    }

    // Create booking
    const bookingData: BookingTable["Insert"] = {
      treatment_plan_id: treatmentPlanId,
      user_id: user.id,
      clinic_id: treatmentPlan.clinic_id,
      status: "pending",
    };

    const { data: booking, error: bookingError } = await (supabase
      .from("bookings")
      .insert(bookingData)
      .select("id")
      .single() as any);

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return { success: false, error: "Failed to create booking" };
    }

    return { success: true, data: { bookingId: booking.id } };
  } catch (error) {
    console.error("Accept treatment plan error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBookings(): Promise<ActionResult<Array<BookingTable["Row"] & {
  clinic: Pick<ClinicTable["Row"], "id" | "name" | "city">;
  treatment_plan: TreatmentPlanTable["Row"];
}>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const { data: bookings, error } = await (supabase
      .from("bookings")
      .select(`
        *,
        clinic:clinics(id, name, city),
        treatment_plan:treatment_plans(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as any);

    if (error) {
      console.error("Fetch bookings error:", error);
      return { success: false, error: "Failed to fetch bookings" };
    }

    return { success: true, data: bookings as any || [] };
  } catch (error) {
    console.error("Get bookings error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBookingById(
  id: string
): Promise<ActionResult<BookingTable["Row"] & {
  clinic: ClinicTable["Row"];
  treatment_plan: TreatmentPlanTable["Row"];
}>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const { data: booking, error } = await (supabase
      .from("bookings")
      .select(`
        *,
        clinic:clinics(*),
        treatment_plan:treatment_plans(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as any);

    if (error || !booking) {
      return { success: false, error: "Booking not found" };
    }

    return { success: true, data: booking as any };
  } catch (error) {
    console.error("Get booking by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function cancelBooking(
  bookingId: string
): Promise<ActionResult<{ success: true }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const { data: booking } = await (supabase
      .from("bookings")
      .select("id, user_id, status")
      .eq("id", bookingId)
      .single() as any);

    if (!booking || booking.user_id !== user.id) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return { success: false, error: "Cannot cancel completed or already cancelled booking" };
    }

    const { error: updateError } = await (supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId) as any);

    if (updateError) {
      console.error("Booking cancel error:", updateError);
      return { success: false, error: "Failed to cancel booking" };
    }

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("Cancel booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
