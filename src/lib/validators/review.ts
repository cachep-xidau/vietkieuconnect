import { z } from "zod";

/**
 * Review submission validation schema
 * Used for client and server-side validation
 */
export const reviewSubmissionSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be at most 100 characters"),
  content: z.string().min(50, "Review must be at least 50 characters").max(2000, "Review must be at most 2000 characters"),
  treatmentType: z.string().optional(),
  photos: z.array(z.string()).max(5, "Maximum 5 photos allowed").optional(),
});

/**
 * Photo upload validation schema
 */
export const reviewPhotoSchema = z.object({
  file: z.custom<File>(
    (val) => val instanceof File,
    { message: "A valid file is required" }
  ).refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    { message: "Only JPEG, PNG, and WebP images are allowed" }
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    { message: "File size must be under 5MB" }
  ),
  reviewId: z.string().uuid().optional(),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
export type ReviewPhotoInput = z.infer<typeof reviewPhotoSchema>;
