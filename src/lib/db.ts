import { AgendaTable } from '@/schemas/AgendaTable'
import { FasilitasTable } from '@/schemas/FasilitasTable'
import { MediaTable } from '@/schemas/MediaTable'
import { PostTable, PostTagTable, TagTable } from '@/schemas/PostTable'
import { ProdiTable } from '@/schemas/ProdiTable'
import { ProfileTable } from '@/schemas/ProfileTable'
import { TenagaAjarTable } from '@/schemas/TenagaAjarTable'
import { UserTable } from '@/schemas/User'
import { CamelCasePlugin, Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely'
import { createPool } from 'mysql2'

export interface Database {
  agenda: AgendaTable
  fasilitas: FasilitasTable
  media: MediaTable
  post: PostTable
  tag: TagTable
  prodi: ProdiTable
  profile: ProfileTable
  tenagaAjar: TenagaAjarTable
  user: UserTable
  postTag: PostTagTable
}

declare global {
  var db: Kysely<Database> | undefined
}

const DATABASE_CONFIG = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT
    ? parseInt(process.env.MYSQL_CONNECTION_LIMIT)
    : 10,
}

const dialect = new MysqlDialect({
  pool: createPool({
    ...DATABASE_CONFIG,
    typeCast(field, next) {
      if (field.type === 'TINY' && field.length === 1) {
        return field.string() === '1'
      }
      return next()
    },
  }),
})

const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db
}

export default db
