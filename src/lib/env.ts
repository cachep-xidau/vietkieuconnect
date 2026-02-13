/**
 * Environment Variable Validation
 *
 * Validates required environment variables at runtime to prevent
 * silent failures in production.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];

export function validateEnv(): void {
  const missing: RequiredEnvVar[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // NEXT_PUBLIC_SITE_URL is optional on Vercel (VERCEL_URL is auto-set)
  if (!process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_URL) {
    missing.push('NEXT_PUBLIC_SITE_URL' as RequiredEnvVar);
  }

  if (missing.length > 0) {
    const timestamp = new Date().toISOString();
    const errorMsg = `[${timestamp}] [Environment Validation Failed] Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}`;

    throw new Error(errorMsg);
  }

  if (typeof window === 'undefined') {
    console.log('✅ Environment variables validated');
  }
}

/**
 * Returns the site URL, supporting both local dev and Vercel deployments.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
