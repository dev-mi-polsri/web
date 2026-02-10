import { ImageMedia } from '@/schemas/Media'
import { PostScope, RichText } from '@/schemas/_common'

export enum PostType {
  BERITA_UMUM = 'berita-umum',
  PENGUMUMAN = 'pengumuman',
  HMJ = 'hmj',
  AKADEMIK = 'akademik',
  PRESTASI = 'prestasi',
}

export class PostUtility {
  static generateSlug(post: Post) {
    return post.createdAt.toDateString() + '-' +
    post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  static generateTagSlug(tag: Tag) {
    return tag.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }
}

export interface Tag {
  id: string,
  name: string,
  slug: string,
}

export interface Post {
  thumbnail: ImageMedia
  title: string,
  content: RichText,
  type: PostType,
  slug: string,
  tags: Tag[],

  isFeatured: boolean,

  scope: PostScope,

  createdAt: Date,
  updatedAt: Date,
}