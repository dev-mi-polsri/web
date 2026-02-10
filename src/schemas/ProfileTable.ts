import { MediaUrl } from '@/schemas/MediaTable'
import { PostScope, RichText } from '@/schemas/_common'
import { ColumnType, Generated, Insertable, Selectable } from 'kysely'

export interface ProfileTable {
  id: Generated<string>
  thumbnail: MediaUrl
  title: string
  description: string
  content: RichText
  slug: string

  scope: PostScope

  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type Profile = Selectable<ProfileTable>
export type NewProfile = Insertable<ProfileTable>
export type UpdateProfile = Insertable<ProfileTable>
