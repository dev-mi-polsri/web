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
          FixedToolbarFeature(),
          HorizontalRuleFeature(),
          InlineToolbarFeature(),
          BlocksFeature({ blocks: [MediaBlock] }),
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
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
  ],
}
