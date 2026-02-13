"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/clinics", label: t("clinics") },
    { href: "/how-it-works", label: t("howItWorks") },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname.endsWith("/en") || pathname.endsWith("/vi");
    }
    return pathname.includes(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border transition-all duration-200",
        isScrolled
          ? "bg-bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-bg-card/80"
          : "bg-bg-card"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary transition-colors hover:text-primary-hover"
        >
          VietKieuConnect
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(link.href)
                  ? "text-primary"
                  : "text-text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Button asChild size="sm">
            <Link href="/login">{tCommon("signIn")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-bg-card md:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "py-3 text-base font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-text-secondary hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <LanguageToggle />
              <Button asChild size="sm">
                <Link href="/login">{tCommon("signIn")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
