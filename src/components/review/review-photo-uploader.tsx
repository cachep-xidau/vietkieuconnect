"use client";

import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { PhotoPreview } from "./photo-preview";

interface ReviewPhotoUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
}

/**
 * Photo uploader with drag & drop support
 * Validates file types (images only), size, and count
 */
export function ReviewPhotoUploader({
  value = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  disabled = false,
  error,
}: ReviewPhotoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const errors: string[] = [];

    // Check total count
    if (value.length + filesArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} photos allowed`);
    }

    // Validate each file
    const validFiles = filesArray.filter((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`);
        return false;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        errors.push(`${file.name} exceeds ${maxSizeMB}MB`);
        return false;
      }

      return true;
    });

    if (errors.length > 0) {
      setValidationError(errors[0]);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Add valid files
    const updatedFiles = [...value, ...validFiles].slice(0, maxFiles);
    onChange(updatedFiles);
    setValidationError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    validateAndAddFiles(e.target.files);
    // Reset input value to allow re-uploading same file
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const displayError = validationError || error;

  return (
    <div className="space-y-3">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          displayError && "border-red-500"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG up to {maxSizeMB}MB (max {maxFiles} photos)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {value.length} / {maxFiles} photos uploaded
        </p>
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}

      {/* Photo Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {value.map((file, index) => (
            <PhotoPreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
