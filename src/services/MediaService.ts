import { MediaCriteria, MediaRepository } from '@/repository/MediaRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Database } from '@/lib/db'
import type { Media, MediaUrl, NewMedia, UpdateMedia } from '@/schemas/MediaTable'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface IMediaService {
  getMedia(criteria: MediaCriteria, pageable?: PaginationRequest): Promise<PaginatedResult<Media>>
  getMediaByUrl(url: MediaUrl): Promise<Media>
  createMedia(data: NewMedia): Promise<boolean>
  updateMediaByUrl(url: MediaUrl, data: UpdateMedia): Promise<boolean>
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

  constructor(db: Kysely<Database>) {
    this.repository = new MediaRepository(db)
  }

  async getMedia(
    criteria: MediaCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Media>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getMediaByUrl(url: MediaUrl): Promise<Media> {
    const media = await this.repository.getByUrl(url)
    if (!media) {
      throw new MediaNotFoundError(`Media with url ${url} not found`)
    }
    return media
  }

  async createMedia(data: NewMedia): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async updateMediaByUrl(url: MediaUrl, data: UpdateMedia): Promise<boolean> {
    await this.repository.updateByUrl(url, data)
    return true
  }

  async deleteMediaByUrl(url: MediaUrl): Promise<boolean> {
    await this.repository.deleteByUrl(url)
    return true
  }
}
