'use server'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import db from '@/lib/db'
import { MediaService } from '@/services/MediaService'
import type { MediaCriteria } from '@/repository/MediaRepository'
import type { PaginationRequest } from '@/repository/_contracts'

export async function getMedia(criteria: MediaCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheTag('media')
  cacheLife('hours')

  const service = new MediaService(db)
  return service.getMedia(criteria, pageable)
}

export async function getMediaByUrl(url: string) {
  'use cache'
  cacheTag('mediaByUrl', url)
  cacheLife('hours')

  const service = new MediaService(db)
  return service.getMediaUploadUrl(url)
}
