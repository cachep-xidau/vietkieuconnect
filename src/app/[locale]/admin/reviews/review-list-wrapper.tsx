"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ReviewList } from "@/components/admin/review-list";
import { getAllReviews, type ReviewFilter, type AdminReviewRow } from "@/lib/actions/admin-review-fetch-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * Client wrapper for review list with state management
 */
export function ReviewListWrapper() {
  const t = useTranslations("admin.reviews");
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    const result = await getAllReviews(filter);

    if (result.success) {
      setReviews(result.data);
    } else {
      toast.error(result.error || "Failed to fetch reviews");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <ReviewList
      reviews={reviews}
      filter={filter}
      onFilterChange={setFilter}
      onRefresh={fetchReviews}
      translations={{
        all: t("all"),
        flagged: t("flagged"),
        clinic: t("clinic"),
        user: t("user"),
        rating: t("rating"),
        content: t("content"),
        status: t("status"),
        actions: t("actions"),
        bulkDelete: t("bulkDelete"),
        confirmBulkDelete: t("confirmBulkDelete"),
        noReviews: t("noReviews"),
        unflag: t("unflag"),
        delete: t("delete"),
        confirmDelete: t("confirmDelete"),
        cancel: t("cancel"),
        confirm: t("confirm"),
      }}
    />
  );
}
