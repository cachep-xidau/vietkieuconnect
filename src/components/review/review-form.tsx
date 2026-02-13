"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { reviewSubmissionSchema, type ReviewSubmissionInput } from "@/lib/validators/review";
import { submitReview } from "@/lib/actions/review-actions";
import { RatingInput } from "./rating-input";
import { ReviewPhotoUploader } from "./review-photo-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReviewFormProps } from "./review-form-types";

/**
 * Review submission form
 * Includes rating, title, content, treatment type, and photo upload
 */
export function ReviewForm({
  bookingId,
  clinicName,
  translations: t,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewSubmissionInput>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
      treatmentType: "",
      photos: [],
    },
  });

  const rating = watch("rating");

  const onSubmit = async (data: ReviewSubmissionInput) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("rating", data.rating.toString());
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.treatmentType) {
        formData.append("treatmentType", data.treatmentType);
      }

      uploadedPhotos.forEach((file) => {
        formData.append("photos", file);
      });

      const result = await submitReview(bookingId, formData);

      if (!result.success) {
        throw new Error(result.error || t.error);
      }

      toast.success(t.success);
      router.refresh();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error instanceof Error ? error.message : t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotosChange = (files: File[]) => {
    setUploadedPhotos(files);
    setValue("photos", files.map((f) => f.name));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Clinic Name Display */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Review for</p>
        <p className="text-lg font-semibold">{clinicName}</p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating" className="text-base">
          {t.ratingLabel} <span className="text-red-500">*</span>
        </Label>
        <RatingInput
          value={rating}
          onChange={(value) => setValue("rating", value, { shouldValidate: true })}
          disabled={isSubmitting}
        />
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          {t.titleLabel} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t.titlePlaceholder}
          disabled={isSubmitting}
          {...register("title")}
          className={cn(errors.title && "border-red-500")}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-base">
          {t.contentLabel} <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="content"
          rows={6}
          placeholder={t.contentPlaceholder}
          disabled={isSubmitting}
          {...register("content")}
          className={cn(
            "w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary",
            errors.content ? "border-red-500" : "border-gray-300"
          )}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Treatment Type (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="treatmentType" className="text-base">
          {t.treatmentTypeLabel}
        </Label>
        <Input
          id="treatmentType"
          placeholder={t.treatmentTypePlaceholder}
          disabled={isSubmitting}
          {...register("treatmentType")}
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="text-base">{t.photosLabel}</Label>
        <ReviewPhotoUploader
          value={uploadedPhotos}
          onChange={handlePhotosChange}
          disabled={isSubmitting}
          error={errors.photos?.message}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.submitting}
          </>
        ) : (
          t.submit
        )}
      </Button>
    </form>
  );
}
