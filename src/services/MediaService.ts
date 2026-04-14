import { MediaCriteria, MediaRepository } from '@/repository/MediaRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Database } from '@/lib/db'
import {
  MediaTypeFactory,
  type Media,
  type MediaUrl,
  type NewMedia,
  type UpdateMedia,
} from '@/schemas/MediaTable'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from '@/services/_common'
import { IOAdapter, VercelBlobIOAdapter } from '@/lib/io'

export interface IMediaService {
  getMedia(criteria: MediaCriteria, pageable?: PaginationRequest): Promise<PaginatedResult<Media>>
  getMediaById(id: string): Promise<Media>
  getMediaByUrl(url: MediaUrl): Promise<Media>
  getMediaUploadUrl(url: string): Promise<File>
  createMedia(data: NewMedia): Promise<boolean>
  updateMediaById(id: string, data: UpdateMedia): Promise<boolean>
  updateMediaByUrl(url: MediaUrl, data: UpdateMedia): Promise<boolean>
  deleteMediaById(id: string): Promise<boolean>
  deleteMediaByUrl(url: MediaUrl): Promise<boolean>
}

export class MediaNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'MEDIA_NOT_FOUND', 404)
    this.name = 'MediaNotFoundError'
  }
}

export class MediaService implements IMediaService {
  private repository: MediaRepository
  private io: IOAdapter

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new MediaRepository(db)
    this.io = io ?? new VercelBlobIOAdapter()
  }

  async getMedia(
    criteria: MediaCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Media>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getMediaUploadUrl(url: string): Promise<File> {
    const isVercelBlobUrl = (url: string) => url.startsWith('https://') && url.includes('.blob.vercel-storage.com')
    const isLocalUrl = (url: string) => url.startsWith('/api/media/uploads/')

    let resolvedUrl: string
    let mediaUrl: MediaUrl

    if (isVercelBlobUrl(url)) {
      // Route to blob proxy endpoint
      resolvedUrl = `/api/blob-proxy/${encodeURIComponent(url)}`
      mediaUrl = resolvedUrl as MediaUrl
    } else if (isLocalUrl(url)) {
      // Keep local URL as-is
      resolvedUrl = url
      mediaUrl = url as MediaUrl
    } else {
      throw new ServiceError(`Invalid URL format: ${url}. Must be a Vercel Blob URL or local upload URL`, 'INVALID_URL', 400)
    }

    const media = await this.getMediaByUrl(mediaUrl)

    if (!media) {
      throw new MediaNotFoundError(`Media with url ${mediaUrl} not found`)
    }

    // Extract filename from original URL (works for both local and Vercel Blob URLs)
    const fileName = url.substring(url.lastIndexOf('/') + 1)
    
    const blob = await this.io.read(fileName, media.mime)

    if (!blob) {
      throw new MediaNotFoundError(`Media file at url ${mediaUrl} could not be read`)
    }

    const file = new File([blob], fileName, { type: media.mime })
    return file
  }

  async getMediaById(id: string): Promise<Media> {
    const media = await this.repository.getById(id)
    if (!media) {
      throw new MediaNotFoundError(`Media with id ${id} not found`)
    }
    return media
  }

  async getMediaByUrl(url: MediaUrl): Promise<Media> {
    const media = await this.repository.getByUrl(url)
    if (!media) {
      throw new MediaNotFoundError(`Media with url ${url} not found`)
    }
    return media
  }

  async createMedia(data: NewMedia): Promise<boolean> {
    await this.repository.create({
      ...data,
      type: data.type ?? MediaTypeFactory.fromMimeType(data.mime),
    })
    return true
  }

  async updateMediaById(id: string, data: UpdateMedia): Promise<boolean> {
    await this.repository.updateById(id, data)
    return true
  }

  async updateMediaByUrl(url: MediaUrl, data: UpdateMedia): Promise<boolean> {
    await this.repository.updateByUrl(url, data)
    return true
  }

  async deleteMediaById(id: string): Promise<boolean> {
    await this.repository.deleteById(id)
    return true
  }

  async deleteMediaByUrl(url: MediaUrl): Promise<boolean> {
    await this.repository.deleteByUrl(url)
    return true
  }
}
