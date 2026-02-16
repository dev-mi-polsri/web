import { MediaType } from '@/schemas/MediaTable'

export const DOKUMEN_TYPE_LABEL: Record<MediaType, string> = {
  [MediaType.IMAGE]: 'Gambar',
  [MediaType.VIDEO]: 'Video',
  [MediaType.PDF]: 'PDF',
  [MediaType.UNKNOWN]: 'Unknown',
}
