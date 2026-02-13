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

export const imageUploadSchema = z.object({
  file: z.any(), // File object validated on client
  consultationId: z.string().uuid(),
  imageType: z.enum(["xray", "photo", "other"]).default("photo"),
});

export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
