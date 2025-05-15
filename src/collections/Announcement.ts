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

// TODO: nama, nama eng, desc, desc english

export const Announcement: CollectionConfig = {
  slug: 'document',
  labels: {
    singular: 'Dokumen',
    plural: 'Dokumen',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
    {
      name: 'enName',
      label: 'English Name',
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
      name: 'Endescription',
      label: 'English Description',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [generateSlug('name')],
      },
      required: true,
    },
  ],
}
