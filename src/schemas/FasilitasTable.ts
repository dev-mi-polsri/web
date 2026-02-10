import { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { MediaUrl } from '@/schemas/MediaTable'

export interface FasilitasTable {
  id: Generated<string>
  image: MediaUrl
  name: string
  en__name: string
}

export type Fasilitas = Selectable<FasilitasTable>
export type NewFasilitas = Insertable<FasilitasTable>
export type UpdateFasilitas = Updateable<FasilitasTable>
