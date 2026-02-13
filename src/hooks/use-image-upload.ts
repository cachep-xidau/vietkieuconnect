"use client";

import { useState } from "react";

interface UseImageUploadReturn {
  images: File[];
  previews: string[];
  isUploading: boolean;
  progress: number;
  error: string | null;
  addImage: (file: File) => boolean;
  removeImage: (index: number) => void;
  uploadAll: (consultationId: string, uploadFn: (formData: FormData) => Promise<any>) => Promise<boolean>;
  reset: () => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useImageUpload(): UseImageUploadReturn {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const addImage = (file: File): boolean => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported file format. Use JPG, PNG, or WebP.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be less than 20MB");
      return false;
    }

    if (images.length >= 5) {
      setError("Maximum 5 images allowed");
      return false;
    }

    const preview = URL.createObjectURL(file);
    setImages((prev) => [...prev, file]);
    setPreviews((prev) => [...prev, preview]);
    return true;
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const uploadAll = async (
    consultationId: string,
    uploadFn: (formData: FormData) => Promise<any>
  ): Promise<boolean> => {
    if (images.length === 0) return true;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const total = images.length;
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("consultationId", consultationId);
        formData.append("imageType", "photo");

        const result = await uploadFn(formData);

        if (!result.success) {
          setError(result.error || "Upload failed");
          setIsUploading(false);
          return false;
        }

        setProgress(Math.round(((i + 1) / total) * 100));
      }

      setIsUploading(false);
      return true;
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
      return false;
    }
  };

  const reset = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setImages([]);
    setPreviews([]);
    setProgress(0);
    setError(null);
  };

  return {
    images,
    previews,
    isUploading,
    progress,
    error,
    addImage,
    removeImage,
    uploadAll,
    reset,
  };
}
