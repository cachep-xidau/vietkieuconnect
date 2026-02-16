"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const PHONE_NUMBER = "84978282828";
const FACEBOOK_PAGE = "VietKieuConnect";

interface Channel {
    id: string;
    labelKey: string;
    href: string;
    logo: React.ReactNode;
    bg: string;
    hoverBg: string;
}

function WhatsAppLogo() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function ZaloLogo() {
    return (
        <svg viewBox="0 0 48 48" className="h-5 w-5" fill="currentColor">
            <path d="M12.5 6C8.91 6 6 8.91 6 12.5v23C6 39.09 8.91 42 12.5 42h23c3.59 0 6.5-2.91 6.5-6.5v-23C42 8.91 39.09 6 35.5 6h-23zm2.14 11h18.72c.68 0 1.07.78.64 1.3L23.86 31H33.5a.5.5 0 01.5.5v2a.5.5 0 01-.5.5H14.36c-.68 0-1.07-.78-.64-1.3L23.86 20H14.5a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5z" />
        </svg>
    );
}

function FacebookLogo() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2C6.36 2 1.69 6.25 1.05 11.74c-.36 3.06.68 6.1 2.84 8.33a1.06 1.06 0 01.3.74l.06 2.32a1.06 1.06 0 001.49.94l2.59-1.14c.17-.08.36-.1.54-.06.94.26 1.93.39 2.93.39h.2c5.5 0 10.07-4.12 10.95-9.47C23.97 7.89 18.57 2 12 2zm6.87 7.76l-3.36 5.33a1.5 1.5 0 01-2.17.4l-2.67-2a.6.6 0 00-.72 0l-3.6 2.73a.47.47 0 01-.68-.63l3.36-5.33a1.5 1.5 0 012.17-.4l2.67 2a.6.6 0 00.72 0l3.6-2.73a.47.47 0 01.68.63z" />
        </svg>
    );
}

export function ChatChannelWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("chat");

    const channels: Channel[] = [
        {
            id: "whatsapp",
            labelKey: "whatsapp",
            href: `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Hi VietKieuConnect! I'd like to speak with a dental consultant.")}`,
            logo: <WhatsAppLogo />,
            bg: "bg-[#25D366]",
            hoverBg: "hover:bg-[#1da851]",
        },
        {
            id: "zalo",
            labelKey: "zalo",
            href: `https://zalo.me/${PHONE_NUMBER}`,
            logo: <ZaloLogo />,
            bg: "bg-[#0068FF]",
            hoverBg: "hover:bg-[#0055d4]",
        },
        {
            id: "facebook",
            labelKey: "facebook",
            href: `https://m.me/${FACEBOOK_PAGE}`,
            logo: <FacebookLogo />,
            bg: "bg-[#0084FF]",
            hoverBg: "hover:bg-[#006acc]",
        },
        {
            id: "email",
            labelKey: "email",
            href: "mailto:support@vietkieuconnect.com?subject=Dental Consultation Inquiry",
            logo: <Mail className="h-5 w-5" />,
            bg: "bg-primary",
            hoverBg: "hover:bg-primary/90",
        },
    ];

    return (
        <div className="fixed bottom-14 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
            {/* Channel Buttons */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2 mb-2"
                    >
                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-4 min-w-[240px]">
                            <p className="font-semibold text-sm text-text-primary mb-1">{t("title")}</p>
                            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
                        </div>

                        {/* Channel Links */}
                        {channels.map((channel, index) => (
                            <motion.a
                                key={channel.id}
                                href={channel.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-3 ${channel.bg} ${channel.hoverBg} text-white rounded-xl px-4 py-3 shadow-lg transition-colors min-w-[240px]`}
                            >
                                {channel.logo}
                                <span className="font-medium text-sm">{t(channel.labelKey)}</span>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${isOpen
                    ? "bg-gray-600 hover:bg-gray-700 rotate-0"
                    : "bg-primary hover:bg-primary/90"
                    } text-white`}
                aria-label={isOpen ? "Close chat channels" : "Open chat channels"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <X className="h-6 w-6" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <MessageCircle className="h-6 w-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
}
