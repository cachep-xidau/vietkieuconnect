/**
 * Rating calculation utilities for clinic reviews
 */

export interface Review {
  rating: number;
}

export interface RatingBreakdown {
  5: { count: number; percentage: number };
  4: { count: number; percentage: number };
  3: { count: number; percentage: number };
  2: { count: number; percentage: number };
  1: { count: number; percentage: number };
}

/**
 * Calculate average rating from array of reviews
 * @param reviews - Array of review objects with rating field
 * @returns Average rating rounded to 1 decimal place, or 0 if no reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate rating breakdown (star distribution)
 * @param reviews - Array of review objects with rating field
 * @returns Object with count and percentage for each star level (1-5)
 */
export function calculateRatingBreakdown(reviews: Review[]): RatingBreakdown {
  const breakdown: RatingBreakdown = {
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  };

  if (!reviews || reviews.length === 0) {
    return breakdown;
  }

  // Count reviews per rating level
  reviews.forEach((review) => {
    const rating = review.rating as 1 | 2 | 3 | 4 | 5;
    if (rating >= 1 && rating <= 5) {
      breakdown[rating].count++;
    }
  });

  // Calculate percentages
  const total = reviews.length;
  const keys: Array<keyof RatingBreakdown> = [1, 2, 3, 4, 5];
  keys.forEach((key) => {
    breakdown[key].percentage = Math.round((breakdown[key].count / total) * 100);
  });

  return breakdown;
}

/**
 * Format rating percentage as string
 * @param count - Number of reviews with this rating
 * @param total - Total number of reviews
 * @returns Formatted percentage string (e.g., "45%")
 */
export function formatRatingPercentage(count: number, total: number): string {
  if (total === 0) {
    return "0%";
  }
  const percentage = Math.round((count / total) * 100);
  return `${percentage}%`;
}
