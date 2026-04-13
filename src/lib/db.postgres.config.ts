import { PoolConfig } from 'pg'

export const DATABASE_POSTGRES_CONFIG: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  max: process.env.POSTGRES_CONNECTION_LIMIT ? parseInt(process.env.POSTGRES_CONNECTION_LIMIT) : 10,
  // Timezone is handled at the database level via SQL SET timezone
}
