"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { X, Info } from "lucide-react";

const DISMISSED_KEY = "vkc-disclaimer-dismissed";

export function DisclaimerBanner() {
    const t = useTranslations("legal");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        localStorage.setItem(DISMISSED_KEY, "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900 text-white px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center gap-3">
                <Info className="h-4 w-4 flex-shrink-0 text-amber-400" />
                <p className="text-xs flex-1 leading-relaxed">
                    {t("disclaimerBanner.text")}{" "}
                    <Link href="/disclaimer" className="underline hover:text-amber-300 transition-colors">
                        {t("disclaimerBanner.learnMore")}
                    </Link>
                </p>
                <button
                    onClick={dismiss}
                    className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
