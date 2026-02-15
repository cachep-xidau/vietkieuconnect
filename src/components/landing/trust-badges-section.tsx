"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Clock, DollarSign, Lock } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
    { key: "verified", icon: ShieldCheck },
    { key: "response", icon: Clock },
    { key: "transparent", icon: DollarSign },
    { key: "secure", icon: Lock },
] as const;

export function TrustBadgesSection() {
    const t = useTranslations("landing.trustBadges");

    return (
        <section className="bg-bg-primary border-b border-border">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <motion.div
                                key={badge.key}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">
                                        {t(badge.key)}
                                    </p>
                                    <p className="text-xs text-text-secondary truncate">
                                        {t(`${badge.key}Desc`)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
