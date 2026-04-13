import { betterAuth } from 'better-auth'
import { createPool as createMySqlPool, Pool as MySQLPool } from 'mysql2/promise'
import { DATABASE_CONFIG } from './db.config'
import { admin, organization } from 'better-auth/plugins'
import { Pool as PostgresPool } from 'pg'
import { DATABASE_POSTGRES_CONFIG } from './db.postgres.config'

export const APP_ROLES = ['user', 'admin'] as const
export type AppRole = (typeof APP_ROLES)[number]

const DATABASE_TYPE = process.env.DATABASE_TYPE ?? 'postgres'

let db: MySQLPool | PostgresPool

if (DATABASE_TYPE === 'postgres') {
  db = new PostgresPool(DATABASE_POSTGRES_CONFIG)
} else if (DATABASE_TYPE === 'mysql') {
  db = createMySqlPool(DATABASE_CONFIG)
} else {
  throw new Error('Unsupported DATABASE_TYPE')
}

// TODO: Prioritize postgresql
export const auth = betterAuth({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  database: db,
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
  trustedOrigins:
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000']
      : [
          'https://manajemeninformatika.polsri.ac.id',
          'https://www.manajemeninformatika.polsri.ac.id',
        ],
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
