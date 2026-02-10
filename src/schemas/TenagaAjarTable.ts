import { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { MediaUrl } from '@/schemas/MediaTable'

export enum JenisTenagaAjar {
  DOSEN = 'Dosen',
  TENDIK = 'Tendik',
}

export enum Homebase {
  D4 = "D4 Manajemen Informatika",
  D3 = "D3 Manajemen Informatika",
}

export interface TenagaAjarTable {
  id: Generated<string>;
  nama: string;
  jenis: JenisTenagaAjar;
  homebase: Homebase;
  foto: MediaUrl;

  nip: string
  nidn?: string
  nuptk?: string

  /// Moves Priority to the first position in the list
  isPejabat: boolean;
}

export type TenagaAjar = Selectable<TenagaAjarTable>;
export type NewTenagaAjar = Insertable<TenagaAjarTable>;
export type UpdateTenagaAjar = Updateable<NewTenagaAjar>;