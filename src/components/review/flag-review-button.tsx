"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { flagReview } from "@/lib/actions/review-flag-actions";

interface FlagReviewButtonProps {
  reviewId: string;
  isFlagged?: boolean;
  isOwnReview?: boolean;
  translations: {
    flag: string;
    flagReason: string;
    flagReasonSpam: string;
    flagReasonInappropriate: string;
    flagReasonFake: string;
    alreadyFlagged: string;
    flagSuccess: string;
    cancel: string;
    submit: string;
  };
}

const FLAG_REASONS = [
  { value: "spam", labelKey: "flagReasonSpam" as const },
  { value: "inappropriate", labelKey: "flagReasonInappropriate" as const },
  { value: "fake", labelKey: "flagReasonFake" as const },
];

/**
 * Flag review button for users to report inappropriate content
 * Shows dialog with reason selection
 */
export function FlagReviewButton({
  reviewId,
  isFlagged = false,
  isOwnReview = false,
  translations: t,
}: FlagReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show flag button if user owns the review or already flagged
  if (isOwnReview || isFlagged) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);

    const result = await flagReview(reviewId, selectedReason);

    if (result.success) {
      toast.success(t.flagSuccess);
      setIsOpen(false);
      // Optionally refresh the page or update UI
      window.location.reload();
    } else {
      toast.error(result.error || "Failed to flag review");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
        >
          <Flag className="h-4 w-4 mr-1" />
          {t.flag}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.flag}</DialogTitle>
          <DialogDescription>
            Help us maintain quality by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">{t.flagReason}</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {FLAG_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {t[reason.labelKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedReason}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
