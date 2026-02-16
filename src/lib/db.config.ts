import { PoolOptions } from 'mysql2'

export const DATABASE_CONFIG: PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT
    ? parseInt(process.env.MYSQL_CONNECTION_LIMIT)
    : 10,
  timezone: 'Z', // Important to ensure consistent timezone values
}
