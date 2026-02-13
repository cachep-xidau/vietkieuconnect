"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Flag, Star, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewModerationActions } from "./review-moderation-actions";
import { bulkDeleteReviews } from "@/lib/actions/admin-review-moderation-actions";
import type { AdminReviewRow, ReviewFilter } from "@/lib/actions/admin-review-fetch-actions";

interface ReviewListProps {
  reviews: AdminReviewRow[];
  filter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  onRefresh: () => void;
  translations: {
    all: string;
    flagged: string;
    clinic: string;
    user: string;
    rating: string;
    content: string;
    status: string;
    actions: string;
    bulkDelete: string;
    confirmBulkDelete: string;
    noReviews: string;
    unflag: string;
    delete: string;
    confirmDelete: string;
    cancel: string;
    confirm: string;
  };
}

/**
 * Admin review list with filters, bulk actions, and moderation
 */
export function ReviewList({
  reviews,
  filter,
  onFilterChange,
  onRefresh,
  translations: t,
}: ReviewListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const allSelected = reviews.length > 0 && selectedIds.size === reviews.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < reviews.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map((r) => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `${t.confirmBulkDelete} (${selectedIds.size} reviews)`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);

    const result = await bulkDeleteReviews(Array.from(selectedIds));

    if (result.success) {
      toast.success(`${result.data.deletedCount} reviews deleted`);
      setSelectedIds(new Set());
      onRefresh();
    } else {
      toast.error(result.error || "Failed to delete reviews");
    }

    setIsBulkDeleting(false);
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => onFilterChange(v as ReviewFilter)}>
          <TabsList>
            <TabsTrigger value="all">{t.all}</TabsTrigger>
            <TabsTrigger value="flagged">
              <Flag className="h-4 w-4 mr-1" />
              {t.flagged}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {t.bulkDelete} ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Reviews Table */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t.noReviews}</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>{t.clinic}</TableHead>
                <TableHead>{t.user}</TableHead>
                <TableHead className="w-24">{t.rating}</TableHead>
                <TableHead>{t.content}</TableHead>
                <TableHead className="w-32">{t.status}</TableHead>
                <TableHead className="w-48">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(review.id)}
                      onCheckedChange={() => toggleRow(review.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{review.clinic?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {review.user?.full_name || "Anonymous"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{review.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {review.content}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.flagged ? (
                      <Badge variant="destructive" className="gap-1">
                        <Flag className="h-3 w-3" />
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{review.status}</Badge>
                    )}
                    {review.flag_reason && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {review.flag_reason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <ReviewModerationActions
                      reviewId={review.id}
                      isFlagged={review.flagged || false}
                      onSuccess={onRefresh}
                      translations={{
                        unflag: t.unflag,
                        delete: t.delete,
                        confirmDelete: t.confirmDelete,
                        cancel: t.cancel,
                        confirm: t.confirm,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
