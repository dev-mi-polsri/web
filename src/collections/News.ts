import { MediaBlock } from '@/components/richtext/blocks/media/config'
import {
  FixedToolbarFeature,
  lexicalEditor,
  BlocksFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'
import { generateSlug } from './_lib'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Berita',
    plural: 'Berita',
  },

  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'global',
      label: 'Global News',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: "Apabila Centang Ini Aktif Berita Akan Ditampilkan Di Tab Berita 'English'",
      },
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Menampilkan Berita Di Highlight Berita Utama (Hanya 3 Yang Terbaru Akan Tampil)',
      },
    },
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Konten',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [MediaBlock] }),
          FixedToolbarFeature(),
          HorizontalRuleFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [generateSlug('judul')],
      },
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
