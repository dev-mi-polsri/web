import { AgendaTable } from '@/schemas/AgendaTable'
import { FasilitasTable } from '@/schemas/FasilitasTable'
import { MediaTable } from '@/schemas/MediaTable'
import { PostTable, PostTagTable, TagTable } from '@/schemas/PostTable'
import { ProdiTable } from '@/schemas/ProdiTable'
import { ProfileTable } from '@/schemas/ProfileTable'
import { TenagaAjarTable } from '@/schemas/TenagaAjarTable'
import { CamelCasePlugin, Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely'
import { createPool } from 'mysql2'
import { DokumenTable } from '@/schemas/DokumenTable'
import { DATABASE_CONFIG } from './db.config'

export interface Database {
  agenda: AgendaTable
  fasilitas: FasilitasTable
  media: MediaTable
  post: PostTable
  tag: TagTable
  prodi: ProdiTable
  profile: ProfileTable
  tenagaAjar: TenagaAjarTable
  postTag: PostTagTable
  dokumen: DokumenTable
}

declare global {
  var db: Kysely<Database> | undefined
}

const pool = createPool({
  ...DATABASE_CONFIG,
  typeCast(field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1'
    }
    return next()
  },
})

const dialect = new MysqlDialect({
  pool,
})

const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db
}

export default db
