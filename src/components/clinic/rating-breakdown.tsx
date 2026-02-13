import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { calculateRatingBreakdown } from "@/lib/utils/rating-calculator";
import { useTranslations } from "next-intl";

interface Review {
  rating: number;
}

interface RatingBreakdownProps {
  reviews: Review[];
}

/**
 * Display rating distribution breakdown with visual bars
 * Shows percentage and count for each star level (5-1)
 */
export function RatingBreakdown({ reviews }: RatingBreakdownProps) {
  const t = useTranslations("rating");
  const breakdown = calculateRatingBreakdown(reviews);
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {t("noReviews")}
      </div>
    );
  }

  const starLevels = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("breakdown")}
        </h3>
        <span className="text-sm text-text-secondary">
          {t("basedOnReviews", { count: totalReviews })}
        </span>
      </div>

      <div className="space-y-2">
        {starLevels.map((level) => {
          const data = breakdown[level];
          const percentage = data.percentage;

          return (
            <div
              key={level}
              className="flex items-center gap-3 text-sm"
            >
              {/* Star label */}
              <div className="flex items-center gap-1 w-16 flex-shrink-0">
                <span className="font-medium text-text-primary">{level}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>

              {/* Progress bar */}
              <div className="flex-1 max-w-md">
                <Progress value={percentage} className="h-2" />
              </div>

              {/* Percentage and count */}
              <div className="flex items-center gap-2 w-20 flex-shrink-0 text-text-secondary">
                <span className="font-medium">{percentage}%</span>
                <span className="text-xs">({data.count})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
