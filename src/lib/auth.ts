import { betterAuth } from 'better-auth'
import { createPool } from 'mysql2/promise'
import { DATABASE_CONFIG } from './db.config'
import { admin, organization } from 'better-auth/plugins'

export const APP_ROLES = ['user', 'admin'] as const
export type AppRole = (typeof APP_ROLES)[number]

const AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? 'https://www.manajemeninformatika.polsri.ac.id'

export const auth = betterAuth({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  database: createPool(DATABASE_CONFIG),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false, // TODO: Implement after SMTP Server granted
  },
  sendResetPassword: async () => {
    // TODO: Password Reset
  },
  trustedOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [AUTH_URL],
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none', // Required for cross-origin cookies
      secure: true, // Required for SameSite=None and only works over HTTPS
      httpOnly: true,
    },
  },
  resetPasswordTokenExpiresIn: 3600,
  plugins: [admin(), organization()],
})
