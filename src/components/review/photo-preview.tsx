"use client";

import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PhotoPreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

/**
 * Photo preview thumbnail with remove button
 * Generates object URL for file preview
 */
export function PhotoPreview({ file, onRemove, disabled }: PhotoPreviewProps) {
  const [preview, setPreview] = useState<string>("");

  // Generate preview URL
  useState(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  });

  return (
    <div className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      {preview ? (
        <Image
          src={preview}
          alt={file.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Remove Button */}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Remove photo"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
