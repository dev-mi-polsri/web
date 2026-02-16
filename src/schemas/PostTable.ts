import { PostScope, RichText } from '@/schemas/_common'
import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'
import { MediaUrl } from '@/schemas/MediaTable'
import { parseDate } from '@/lib/date'

export enum PostType {
  BERITA_UMUM = 'berita-umum',
  PENGUMUMAN = 'pengumuman',
  HMJ = 'hmj',
  AKADEMIK = 'akademik',
  PRESTASI = 'prestasi',
}

export class PostUtility {
  static generateSlug(post: { createdAt: Date; title: string }) {
    return (
      parseDate(post.createdAt) +
      '-' +
      post.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
    )
  }

  static generateTagSlug(tag: { name: string }) {
    return tag.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}

export interface TagTable {
  id: Generated<string>
  name: string
  slug: string
}

export interface PostTable {
  id: Generated<string>
  thumbnail: MediaUrl
  title: string
  content: JSONColumnType<RichText>
  type: PostType
  slug: string

  isFeatured: boolean
  isPublished: boolean

  scope: PostScope

  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export interface PostTagTable {
  postId: string
  tagId: string
}

export type Post = Selectable<PostTable>
export type PostSummary = Pick<
  PostWithTags,
  | 'id'
  | 'title'
  | 'slug'
  | 'thumbnail'
  | 'createdAt'
  | 'isPublished'
  | 'scope'
  | 'tags'
  | 'isFeatured'
>
export type PostWithTags = Post & { tags: Tag[] }
export type NewPost = Omit<Insertable<PostTable>, 'thumbnail'> & {
  thumbnail: File
  /** Optional list of tag IDs to associate with the post. */
  tagIds?: string[]
}
export type UpdatePost = Omit<Updateable<PostTable>, 'thumbnail'> & {
  thumbnail?: File
  /** Optional list of tag IDs to associate with the post (replaces existing when provided). */
  tagIds?: string[]
}

export type Tag = Selectable<TagTable>
export type NewTag = Insertable<TagTable>
export type UpdateTag = Updateable<TagTable>

export type PostTag = Selectable<PostTagTable>
export type NewPostTag = Insertable<PostTagTable>
