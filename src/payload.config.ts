// storage-adapter-import-placeholder
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
// import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Partner } from './collections/Partners'
import { Facility } from './collections/Facility'
import { News } from './collections/News'
import { Agenda } from './collections/Agenda'
import { Profile } from './collections/Profile'
import { StudyProgram } from './collections/StudyProgram'
import { DosenTendik } from './collections/DosenTendik'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Partner, Facility, News, Agenda, Profile, StudyProgram, DosenTendik],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.POSTGRESQL_DATABASE_URI,
    },
  }),
})
