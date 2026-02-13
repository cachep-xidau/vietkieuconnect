"use server";

import { createClient } from "@/lib/supabase/server";
import { ClinicTable } from "@/types/database-clinic-tables";
import { ActionResult } from "@/types/actions";
import { clinicFormSchema, ClinicFormData } from "@/lib/validators/clinic";

/**
 * Create a new clinic
 */
export async function createClinic(
  data: ClinicFormData
): Promise<ActionResult<ClinicTable["Row"]>> {
  try {
    // Validate input
    const validated = clinicFormSchema.parse(data);

    const supabase = await createClient();

    // Generate slug from name if not provided
    const slug = validated.slug || generateSlug(validated.name);

    const { data: clinic, error } = await (supabase
      .from("clinics")
      .insert({
        name: validated.name,
        slug,
        city: validated.city,
        address: validated.address,
        phone: validated.phone || null,
        email: validated.email || null,
        website: validated.website || null,
        description_en: validated.description_en || null,
        description_vi: validated.description_vi || null,
        services: validated.services,
        pricing: validated.pricing,
        logo_url: validated.logo_url || null,
        photos: validated.photos,
        verified: validated.verified,
        active: true,
      })
      .select()
      .single() as any);

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: clinic,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Validation failed",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create clinic",
    };
  }
}

/**
 * Update existing clinic
 */
export async function updateClinic(
  id: string,
  data: Partial<ClinicFormData>
): Promise<ActionResult<ClinicTable["Row"]>> {
  try {
    // Validate input
    const validated = clinicFormSchema.partial().parse(data);

    const supabase = await createClient();

    const updateData: ClinicTable["Update"] = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    const { data: clinic, error } = await (supabase
      .from("clinics")
      .update(updateData)
      .eq("id", id)
      .select()
      .single() as any);

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: clinic,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Validation failed",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update clinic",
    };
  }
}

/**
 * Toggle clinic verified status
 */
export async function toggleVerified(
  id: string
): Promise<ActionResult<{ verified: boolean }>> {
  try {
    const supabase = await createClient();

    // Get current verified status
    const { data: clinic, error: fetchError } = await (supabase
      .from("clinics")
      .select("verified")
      .eq("id", id)
      .single() as any);

    if (fetchError) {
      return {
        success: false,
        error: fetchError.message,
        code: fetchError.code,
      };
    }

    // Toggle verified status
    const newVerified = !clinic.verified;

    const { error: updateError } = await (supabase
      .from("clinics")
      .update({ verified: newVerified })
      .eq("id", id) as any);

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
        code: updateError.code,
      };
    }

    return {
      success: true,
      data: { verified: newVerified },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle verified status",
    };
  }
}

/**
 * Delete clinic (soft delete by setting active=false)
 */
export async function deleteClinic(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    // Soft delete: set active to false
    const { error } = await (supabase
      .from("clinics")
      .update({ active: false })
      .eq("id", id) as any);

    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete clinic",
    };
  }
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
