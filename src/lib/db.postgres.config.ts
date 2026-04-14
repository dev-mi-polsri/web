import { PoolConfig } from 'pg'

export const DATABASE_POSTGRES_CONFIG: PoolConfig = {
  connectionString: process.env.POSTGRES_URL,
}
