import { CollectionConfig } from 'payload'

export const Agenda: CollectionConfig = {
  slug: 'agenda',
  labels: {
    singular: 'Agenda',
    plural: 'Agenda',
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
      name: 'startDate',
      label: 'Tanggal Mulai',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      label: 'Tanggal Selesai',
      type: 'date',
      required: true,
    },
    {
      name: 'location',
      label: 'Lokasi',
      type: 'text',
    },
  ],
}
