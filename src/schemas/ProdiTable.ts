import { MediaUrl } from '@/schemas/MediaTable'
import { PostScope, RichText } from '@/schemas/_common'
import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export interface ProdiTable {
  id: Generated<string>
  thumbnail: MediaUrl
  title: string
  description: string
  content: JSONColumnType<RichText>
  slug: string

  scope: PostScope

  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type Prodi = Selectable<ProdiTable>
export type NewProdi = Omit<Insertable<ProdiTable>, 'thumbnail'> & { thumbnail: File }
export type UpdateProdi = Omit<Updateable<ProdiTable>, 'thumbnail'> & { thumbnail?: File }
