import { MediaUrl } from '@/schemas/MediaTable'
import { PostScope, RichText } from '@/schemas/_common'
import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export interface ProfileTable {
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

export type Profile = Selectable<ProfileTable>
export type NewProfile = Omit<Insertable<ProfileTable>, 'thumbnail'> & { thumbnail: File }
export type UpdateProfile = Omit<Updateable<ProfileTable>, 'thumbnail'> & { thumbnail?: File }
