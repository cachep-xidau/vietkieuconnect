"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import { consultationRequestSchema } from "@/lib/validators/consultation";
import { ConsultationRequestTable, ConsultationImageTable, TreatmentPlanTable } from "@/types/database-booking-tables";
import { ConsultationRequestInput } from "@/lib/validators/consultation";

export async function submitConsultation(
  data: ConsultationRequestInput
): Promise<ActionResult<{ consultationId: string }>> {
  // Server-side validation
  const validation = consultationRequestSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const insertData: ConsultationRequestTable["Insert"] = {
      user_id: user.id,
      treatment_description: data.treatmentDescription,
      patient_count: data.patientCount,
      travel_dates: data.travelDates?.start
        ? `[${data.travelDates.start}, ${data.travelDates.end || data.travelDates.start}]`
        : null,
      clinic_id: data.clinicId || null,
      status: "pending",
    };

    const { data: consultation, error } = await (supabase
      .from("consultation_requests")
      .insert(insertData)
      .select("id")
      .single() as any);

    if (error) {
      console.error("Consultation insert error:", error);
      return { success: false, error: "Failed to submit consultation request" };
    }

    return { success: true, data: { consultationId: consultation.id } };
  } catch (error) {
    console.error("Submit consultation error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getConsultations(): Promise<ActionResult<ConsultationRequestTable["Row"][]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const { data: consultations, error } = await (supabase
      .from("consultation_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as any);

    if (error) {
      console.error("Fetch consultations error:", error);
      return { success: false, error: "Failed to fetch consultations" };
    }

    return { success: true, data: consultations || [] };
  } catch (error) {
    console.error("Get consultations error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getConsultationById(
  id: string
): Promise<ActionResult<ConsultationRequestTable["Row"] & {
  images: ConsultationImageTable["Row"][];
  treatment_plans: TreatmentPlanTable["Row"][];
}>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const { data: consultation, error: consultationError } = await (supabase
      .from("consultation_requests")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as any);

    if (consultationError || !consultation) {
      return { success: false, error: "Consultation not found" };
    }

    const { data: images } = await (supabase
      .from("consultation_images")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: true }) as any);

    const { data: treatmentPlans } = await (supabase
      .from("treatment_plans")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: false }) as any);

    return {
      success: true,
      data: {
        ...consultation,
        images: images || [],
        treatment_plans: treatmentPlans || [],
      },
    };
  } catch (error) {
    console.error("Get consultation by ID error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function uploadConsultationImage(
  formData: FormData
): Promise<ActionResult<{ imageUrl: string; imageId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    const file = formData.get("file") as File;
    const consultationId = formData.get("consultationId") as string;
    const imageType = (formData.get("imageType") as "xray" | "photo" | "other") || "photo";

    if (!file || !consultationId) {
      return { success: false, error: "Missing required fields" };
    }

    // Verify consultation belongs to user
    const { data: consultation } = await (supabase
      .from("consultation_requests")
      .select("id")
      .eq("id", consultationId)
      .eq("user_id", user.id)
      .single() as any);

    if (!consultation) {
      return { success: false, error: "Consultation not found" };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${consultationId}/${Date.now()}.${fileExt}`;

    // Convert File to Buffer for server-side upload compatibility
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("consultation-images")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/png",
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError.message, uploadError);
      return { success: false, error: `Failed to upload image: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("consultation-images")
      .getPublicUrl(fileName);

    const insertData: ConsultationImageTable["Insert"] = {
      consultation_id: consultationId,
      image_url: publicUrl,
      image_type: imageType,
    };

    const { data: imageRecord, error: insertError } = await (supabase
      .from("consultation_images")
      .insert(insertData)
      .select("id")
      .single() as any);

    if (insertError) {
      console.error("Image record insert error:", insertError);
      return { success: false, error: "Failed to save image record" };
    }

    return { success: true, data: { imageUrl: publicUrl, imageId: imageRecord.id } };
  } catch (error) {
    console.error("Upload consultation image error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteConsultation(
  id: string
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Delete: auth error", authError);
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    console.log("Delete: user authenticated", user.id, "consultation", id);

    // Verify ownership and status
    const { data: consultation, error: selectError } = await (supabase
      .from("consultation_requests")
      .select("id, status, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as any);

    if (selectError) {
      console.error("Delete: select error", selectError);
      return { success: false, error: "Consultation not found" };
    }

    if (!consultation) {
      console.error("Delete: no consultation found for id", id, "user", user.id);
      return { success: false, error: "Consultation not found" };
    }

    console.log("Delete: found consultation", consultation.id, "status:", consultation.status, "user_id:", consultation.user_id);

    if (consultation.status !== "pending") {
      return { success: false, error: "Can only delete pending consultations" };
    }

    // Soft-delete using valid CHECK constraint value: 'declined'
    // DB CHECK: status IN ('pending', 'quoted', 'accepted', 'declined', 'expired')
    const { data: updateData, error, count } = await (supabase
      .from("consultation_requests")
      .update({ status: "declined" })
      .eq("id", id)
      .eq("user_id", user.id)
      .select() as any);

    console.log("Delete: update result - data:", updateData, "error:", error, "count:", count);

    if (error) {
      console.error("Delete consultation error:", JSON.stringify(error));
      return { success: false, error: `Failed to delete: ${error.message || error.code || "unknown"}` };
    }

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("Delete consultation catch error:", error);
    return { success: false, error: `Unexpected error: ${error instanceof Error ? error.message : "unknown"}` };
  }
}

export async function updateConsultation(
  id: string,
  data: Partial<ConsultationRequestInput>
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required", code: "UNAUTHENTICATED" };
    }

    // Verify ownership and status
    const { data: consultation } = await (supabase
      .from("consultation_requests")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as any);

    if (!consultation) {
      return { success: false, error: "Consultation not found" };
    }

    if (consultation.status !== "pending") {
      return { success: false, error: "Can only edit pending consultations" };
    }

    const updateData: Record<string, unknown> = {};
    if (data.treatmentDescription !== undefined) {
      updateData.treatment_description = data.treatmentDescription;
    }
    if (data.patientCount !== undefined) {
      updateData.patient_count = data.patientCount;
    }
    if (data.travelDates !== undefined) {
      updateData.travel_dates = data.travelDates?.start
        ? `[${data.travelDates.start}, ${data.travelDates.end || data.travelDates.start}]`
        : null;
    }
    if (data.clinicId !== undefined) {
      updateData.clinic_id = data.clinicId || null;
    }

    const { error } = await (supabase
      .from("consultation_requests")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id) as any);

    if (error) {
      console.error("Update consultation error:", error);
      return { success: false, error: "Failed to update consultation" };
    }

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("Update consultation error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

