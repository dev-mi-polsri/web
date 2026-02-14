import { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { MediaUrl } from '@/schemas/MediaTable'

export interface DokumenTable {
  id: Generated<string>
  name: string
  enName: string
  url: MediaUrl
}

export type Dokumen = Selectable<DokumenTable>
export type NewDokumen = Omit<Insertable<DokumenTable>, 'url'> & { file: File }
export type UpdateDokumen = Omit<Updateable<DokumenTable>, 'url'> & { file?: File }