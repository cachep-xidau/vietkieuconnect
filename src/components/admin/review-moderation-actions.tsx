"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { unflagReview, deleteReview } from "@/lib/actions/admin-review-moderation-actions";

interface ReviewModerationActionsProps {
  reviewId: string;
  isFlagged: boolean;
  onSuccess?: () => void;
  translations: {
    unflag: string;
    delete: string;
    confirmDelete: string;
    cancel: string;
    confirm: string;
  };
}

/**
 * Admin moderation actions for reviews
 * Approve (unflag) and delete buttons
 */
export function ReviewModerationActions({
  reviewId,
  isFlagged,
  onSuccess,
  translations: t,
}: ReviewModerationActionsProps) {
  const [isUnflagging, setIsUnflagging] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUnflag = async () => {
    setIsUnflagging(true);

    const result = await unflagReview(reviewId);

    if (result.success) {
      toast.success("Review approved");
      onSuccess?.();
    } else {
      toast.error(result.error || "Failed to approve review");
    }

    setIsUnflagging(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteReview(reviewId);

    if (result.success) {
      toast.success("Review deleted");
      setIsDeleteDialogOpen(false);
      onSuccess?.();
    } else {
      toast.error(result.error || "Failed to delete review");
    }

    setIsDeleting(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isFlagged && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleUnflag}
          disabled={isUnflagging}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          {isUnflagging ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mr-1" />
          )}
          {t.unflag}
        </Button>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {t.delete}
      </Button>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>{t.confirmDelete}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
