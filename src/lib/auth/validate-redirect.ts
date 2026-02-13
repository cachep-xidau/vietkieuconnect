/**
 * Redirect URL Validation
 *
 * Prevents open redirect vulnerabilities by validating redirect URLs
 * against an allowlist of safe paths and blocking external origins.
 */

const ALLOWED_REDIRECT_PATHS = [
  '/',
  '/dashboard',
  '/profile',
  '/bookings',
  '/consultations',
  '/reviews'
] as const;

type AllowedPath = typeof ALLOWED_REDIRECT_PATHS[number];

interface ValidationResult {
  isValid: boolean;
  safePath: string;
  reason?: string;
}

/**
 * Validates a redirect URL against security rules
 *
 * @param redirectUrl - The URL to validate (can be relative or absolute)
 * @param currentOrigin - The current site origin (e.g., "http://localhost:3000")
 * @returns Validation result with safe fallback path
 */
export function validateRedirect(
  redirectUrl: string | null,
  currentOrigin: string
): ValidationResult {
  // Default fallback
  const defaultPath = '/dashboard';

  // Handle null/undefined
  if (!redirectUrl) {
    return {
      isValid: true,
      safePath: defaultPath,
      reason: 'No redirect URL provided, using default'
    };
  }

  try {
    // Parse the redirect URL
    const url = new URL(redirectUrl, currentOrigin);

    // Block cross-origin redirects
    if (url.origin !== currentOrigin) {
      const timestamp = new Date().toISOString();
      console.warn(
        `[${timestamp}] [Security] Blocked cross-origin redirect attempt:`,
        `from ${currentOrigin} to ${url.origin}`
      );

      return {
        isValid: false,
        safePath: defaultPath,
        reason: 'Cross-origin redirect blocked'
      };
    }

    // Extract pathname (includes leading slash)
    const pathname = url.pathname;

    // Check if pathname is in allowlist (exact match or starts with allowed path)
    const isAllowed = ALLOWED_REDIRECT_PATHS.some(allowedPath => {
      if (allowedPath === '/') {
        return pathname === '/';
      }
      return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
    });

    if (!isAllowed) {
      const timestamp = new Date().toISOString();
      console.warn(
        `[${timestamp}] [Security] Blocked non-allowlisted path redirect:`,
        pathname
      );

      return {
        isValid: false,
        safePath: defaultPath,
        reason: 'Path not in allowlist'
      };
    }

    // Valid redirect
    return {
      isValid: true,
      safePath: pathname
    };
  } catch (error) {
    // Invalid URL format
    const timestamp = new Date().toISOString();
    console.warn(
      `[${timestamp}] [Security] Invalid redirect URL format:`,
      redirectUrl,
      error
    );

    return {
      isValid: false,
      safePath: defaultPath,
      reason: 'Invalid URL format'
    };
  }
}
