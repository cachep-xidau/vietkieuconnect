import { z } from "zod";

export const consultationRequestSchema = z.object({
  treatmentDescription: z.string().min(10, "Please describe your treatment needs (min 10 characters)"),
  patientCount: z.coerce.number().min(1).max(10).default(1),
  travelDates: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  clinicId: z.string().uuid().optional(),
});

const fileSchema = z.custom<File>(
  (val) => val instanceof File,
  { message: "A valid file is required" }
).refine(
  (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
  { message: "Only JPEG, PNG, and WebP images are allowed" }
).refine(
  (file) => file.size <= 5 * 1024 * 1024,
  { message: "File size must be under 5MB" }
);

export const imageUploadSchema = z.object({
  file: fileSchema,
  consultationId: z.string().uuid(),
  imageType: z.enum(["xray", "photo", "other"]).default("photo"),
});

export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
