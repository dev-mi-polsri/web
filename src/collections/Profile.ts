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

export const Profile: CollectionConfig = {
  slug: 'profile',
  labels: {
    singular: 'Profil',
    plural: 'Profil',
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
      label: 'Global',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: "Apabila Centang Ini Aktif, Item Akan Ditampilkan Di Tab Berita 'English'",
      },
    },
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      label: 'Deskripsi',
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
  ],
}
