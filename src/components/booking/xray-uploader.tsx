"use client";

import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface XrayUploaderProps {
  images: File[];
  previews: string[];
  onAddImage: (file: File) => boolean;
  onRemoveImage: (index: number) => void;
  error?: string | null;
}

export function XrayUploader({ images, previews, onAddImage, onRemoveImage, error }: XrayUploaderProps) {
  const t = useTranslations();
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (!consentGiven && images.length === 0) {
      // Store files for after consent
      setPendingFiles(fileArray);
      setShowConsent(true);
      // Reset input so same files can be re-selected
      e.target.value = "";
      return;
    }

    fileArray.forEach((file) => {
      onAddImage(file);
    });
    // Reset input
    e.target.value = "";
  };

  const handleConsentConfirm = () => {
    setConsentGiven(true);
    setShowConsent(false);
    // Process the pending files that were stored before consent
    pendingFiles.forEach((file) => {
      onAddImage(file);
    });
    setPendingFiles([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload" className="text-base font-medium">
          {t("consultation.uploadXray")}
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          {t("consultation.uploadHint")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={preview} className="relative aspect-square rounded-lg overflow-hidden border">
            <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => onRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {images.length < 5 && (
          <label
            htmlFor="image-upload"
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <Camera className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {images.length === 0 ? t("consultation.uploadXray") : `Add more (${5 - images.length} left)`}
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="sr-only"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Upload Consent</DialogTitle>
            <DialogDescription className="pt-4 space-y-2">
              <p>{t("consultation.consent")}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConsent(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConsentConfirm}>
              {t("common.confirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
