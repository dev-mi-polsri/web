import { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { MediaUrl, NewMedia } from '@/schemas/MediaTable'

export interface FasilitasTable {
  id: Generated<string>
  image: MediaUrl
  name: string
  enName: string
}

export type Fasilitas = Selectable<FasilitasTable>
export type NewFasilitas = Omit<Insertable<FasilitasTable>, 'image'> & { image: File }
export type UpdateFasilitas = Omit<Updateable<FasilitasTable>, 'image'> & { image?: File }
