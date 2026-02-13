"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useClinicFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const treatmentTypes = searchParams.get("treatments")?.split(",").filter(Boolean) || [];
  const sortBy = searchParams.get("sort") || "rating";
  const city = searchParams.get("city") || "All Cities";

  const isFiltered =
    treatmentTypes.length > 0 ||
    sortBy !== "rating" ||
    city !== "All Cities";

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setTreatmentTypes = useCallback(
    (types: string[]) => {
      updateParams({ treatments: types });
    },
    [updateParams]
  );

  const setSortBy = useCallback(
    (sort: string) => {
      updateParams({ sort });
    },
    [updateParams]
  );

  const setCity = useCallback(
    (cityValue: string) => {
      updateParams({ city: cityValue === "All Cities" ? null : cityValue });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  return {
    treatmentTypes,
    sortBy,
    city,
    isFiltered,
    setTreatmentTypes,
    setSortBy,
    setCity,
    clearFilters,
  };
}
