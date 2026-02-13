import { PostScope } from '@/schemas/_common'
import { PostType } from '@/schemas/PostTable'
import { JSONContent } from '@tiptap/core'

export const POST_TYPE_LABEL: Record<PostType, string> = {
  [PostType.BERITA_UMUM]: 'Berita Umum',
  [PostType.PENGUMUMAN]: 'Pengumuman',
  [PostType.HMJ]: 'HMJ',
  [PostType.AKADEMIK]: 'Akademik',
  [PostType.PRESTASI]: 'Prestasi',
}

export const POST_SCOPE_LABEL: Record<PostScope, string> = {
  [PostScope.NATIONAL]: 'Nasional',
  [PostScope.INTERNATIONAL]: 'Internasional',
}

export const BASE_CONTENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'h1',
      content: [{ type: 'text', text: 'Judul Artikel' }],
    },
    {
      type: 'p',
      content: [
        {
          type: 'text',
          text: 'Tulis konten artikel di sini. Gunakan editor iniatas untuk menulis dan memformat teks.',
        },
      ],
    },
    {
      type: 'ul',
      content: [
        {
          type: 'li',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Item daftar pertama' }],
            },
          ],
        },
      ],
    },
  ],
}
