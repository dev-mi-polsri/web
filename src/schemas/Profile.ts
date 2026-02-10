import { ImageMedia } from '@/schemas/Media'
import { PostScope, RichText } from '@/schemas/_common'

export interface Profile {
  id: string,
  thumbnail: ImageMedia,
  title: string,
  description: string,
  content: RichText,
  slug: string,

  scope: PostScope,

  createdAt: Date,
  updatedAt: Date,
}