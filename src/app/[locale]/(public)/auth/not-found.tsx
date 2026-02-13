"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function AuthNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-text-primary mb-4">
        {t("title")}
      </h2>
      <p className="text-text-secondary mb-8">
        The authentication page you're looking for doesn't exist.
      </p>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Common mistake:
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          ❌ <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">/auth/signin</code> does not exist
        </p>
        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
          ✓ Use <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">/login</code> instead
        </p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/login"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-border rounded-md hover:bg-bg-subtle transition-colors"
        >
          Register
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-border rounded-md hover:bg-bg-subtle transition-colors"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
