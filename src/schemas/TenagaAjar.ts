export enum JenisTenagaAjar {
  DOSEN = 'Dosen',
  TENDIK = 'Tendik',
}

export enum Homebase {
  D4 = "D4 Manajemen Informatika",
  D3 = "D3 Manajemen Informatika",
}

export interface TenagaAjar {
  id: string;
  nama: string;
  jenis: JenisTenagaAjar;
  homebase: Homebase;

  nip: string
  nidn?: string
  nuptk?: string

  /// Moves Priority to the first position in the list
  isPejabat: boolean;
}