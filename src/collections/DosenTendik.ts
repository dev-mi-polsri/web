import { CollectionConfig } from 'payload'

export const DosenTendik: CollectionConfig = {
  slug: 'dosentendik',
  labels: {
    singular: 'Dosen & Tendik',
    plural: 'Dosen & Tendik',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Pastikan Foto Berukuran 1:1',
      },
      required: true,
    },
    {
      name: 'tipe',
      label: 'Tipe',
      type: 'select',
      defaultValue: 'dosen',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Dosen',
          value: 'dosen',
        },
        {
          label: 'Tenaga Pendidik',
          value: 'tendik',
        },
      ],
    },
    {
      name: 'pejabat',
      label: 'Pejabat',
      type: 'checkbox',
    },
    {
      name: 'homebase',
      label: 'Homebase',
      type: 'select',
      defaultValue: 'd4',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'D4 Manajemen Informatika',
          value: 'd4',
        },
        {
          label: 'D3 Manajemen Informatika',
          value: 'd3',
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'nip',
      type: 'text',
      required: true,
    },
    {
      name: 'nidn',
      type: 'text',
    },
    {
      name: 'nuptk',
      type: 'text',
    },
  ],
}
