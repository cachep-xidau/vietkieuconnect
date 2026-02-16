/**
 * Service Category Mapping
 *
 * Maps dental service keywords (Vietnamese) → filter categories.
 * Used by both clinic-card (display) and clinic-actions (filter).
 */

export type ServiceCategory = "implant" | "veneer" | "braces" | "general";

/**
 * Keywords that identify each category.
 * Order matters: first match wins.
 * Case-insensitive matching is used.
 */
const CATEGORY_KEYWORDS: Record<ServiceCategory, string[]> = {
    implant: ["implant", "trồng răng"],
    veneer: ["veneer", "sứ", "dán sứ", "phủ sứ", "bọc sứ"],
    braces: ["niềng", "chỉnh nha", "braces"],
    general: ["tổng quát", "khám", "general", "vệ sinh", "nhổ răng", "tẩy trắng"],
};

/**
 * Determine category for a given service name.
 */
export function getServiceCategory(serviceName: string): ServiceCategory | null {
    const lower = serviceName.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((kw) => lower.includes(kw))) {
            return category as ServiceCategory;
        }
    }
    return null;
}

/**
 * Get unique categories for a list of services.
 */
export function getServiceCategories(services: string[]): ServiceCategory[] {
    const categories = new Set<ServiceCategory>();
    for (const service of services) {
        const cat = getServiceCategory(service);
        if (cat) categories.add(cat);
    }
    return Array.from(categories);
}

/**
 * Check if a clinic's services match ANY of the given filter categories.
 */
export function matchesCategories(
    services: string[],
    filterCategories: ServiceCategory[]
): boolean {
    if (filterCategories.length === 0) return true;
    const clinicCategories = getServiceCategories(services);
    return filterCategories.some((fc) => clinicCategories.includes(fc));
}
