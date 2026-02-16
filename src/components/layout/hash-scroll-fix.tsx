"use client";

import { useEffect } from "react";

/**
 * Re-triggers hash scroll after client hydration completes.
 * Solves layout-shift issues where browser scrolls to hash
 * before dynamic components have their final height.
 */
export function HashScrollFix() {
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;

        // Wait for layout to stabilize after hydration
        const timer = setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
