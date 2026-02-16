import { PostScope } from '@/schemas/_common'
import { JSONContent } from '@tiptap/core'

export const PRODI_SCOPE_LABEL: Record<PostScope, string> = {
  [PostScope.NATIONAL]: 'Nasional',
  [PostScope.INTERNATIONAL]: 'Internasional',
}

export const BASE_CONTENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'h1',
      content: [{ type: 'text', text: 'Judul Program Studi' }],
    },
    {
      type: 'p',
      content: [
        {
          type: 'text',
          text: 'Tulis konten program studi di sini. Gunakan editor di atas untuk menulis dan memformat teks.',
        },
      ],
    },
  ],
}
