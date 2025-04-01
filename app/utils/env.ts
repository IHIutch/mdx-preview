import process from 'node:process'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  emptyStringAsUndefined: true,
  isServer: typeof window === 'undefined',
  clientPrefix: 'PUBLIC_',
  //
  server: {
    TURSO_DATABASE_URL: z.string().min(1),
    TURSO_AUTH_TOKEN: z.string().min(1),
    // VERCEL_PROJECT_PRODUCTION_URL: z.string(),
    // VERCEL_ENV: z.string().optional(),
    VERCEL_URL: z.string().optional(),
  },
  client: {
    // # Misc
    // PUBLIC_ROOT_DOMAIN: z.string().min(1),
    // # Sentry
    // PUBLIC_SENTRY_DSN: z.string().min(1),
  },
  runtimeEnv: process.env,
  onValidationError: (issues) => {
    console.error(
      '❌ Invalid environment variables:',
      issues,
    )
    throw new Error('Invalid environment variables')
  },
  onInvalidAccess: () => {
    throw new Error(
      '❌ Attempted to access a server-side environment variable on the client',
    )
  },
})
