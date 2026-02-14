"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { ConsultationRequestTable, ConsultationImageTable, TreatmentPlanTable } from "@/types/database-booking-tables";
import { ConsultationRequestInput } from "@/lib/validators/consultation";

export async function submitConsultation(
  data: ConsultationRequestInput
): Promise<ActionResult<{ consultationId: string }>> {
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

    const { error: uploadError } = await supabase.storage
      .from("consultation-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return { success: false, error: "Failed to upload image" };
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
