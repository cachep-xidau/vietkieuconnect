import { z } from "zod";

/**
 * Clinic form validation schema
 * Used for create/update clinic operations
 */
export const clinicFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().optional().nullable().or(z.literal("")),
  email: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
  website: z.string().url("Invalid URL format").optional().nullable().or(z.literal("")),
  description_en: z.string().optional().nullable().or(z.literal("")),
  description_vi: z.string().optional().nullable().or(z.literal("")),
  services: z.array(z.string()),
  pricing: z.record(z.string(), z.number()),
  logo_url: z.string().url("Invalid URL format").optional().nullable().or(z.literal("")),
  photos: z.array(z.string().url("Invalid URL format")),
  verified: z.boolean(),
});

export type ClinicFormData = z.infer<typeof clinicFormSchema>;
