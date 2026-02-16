import { PaginatedResult, PaginationRequest, processPagination } from '@/repository/_common'
import { Database } from '@/lib/db'
import { Media, NewMedia, UpdateMedia, MediaUrl } from '@/schemas/MediaTable'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type MediaCriteria = {
  searchKeyword?: string
  type?: Media['type']
  mime?: Media['mime']
  isDownloadable?: boolean
}

export interface IMediaRepository {
  getAll(criteria: MediaCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Media>>

  getById(id: string): Promise<Media | undefined>

  /** Media is addressed by URL (business key). */
  getByUrl(url: MediaUrl): Promise<Media | undefined>
  create(data: NewMedia): Promise<InsertResult>
  updateById(id: string, data: UpdateMedia): Promise<UpdateResult>
  updateByUrl(url: MediaUrl, data: UpdateMedia): Promise<UpdateResult>
  deleteById(id: string): Promise<DeleteResult>
  deleteByUrl(url: MediaUrl): Promise<DeleteResult>
}

export class MediaRepository implements IMediaRepository {
  private db: Kysely<Database>

  constructor(database: Kysely<Database>) {
    this.db = database
  }

  async getAll(
    criteria: MediaCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Media>> {
    let baseQuery = this.db.selectFrom('media')

    if (criteria.searchKeyword) {
      baseQuery = baseQuery.where(
        (eb) => eb.fn('lower', ['media.url']),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }

    if (typeof criteria.isDownloadable === 'boolean') {
      baseQuery = baseQuery.where('media.isDownloadable', '=', criteria.isDownloadable)
    }

    if (criteria.type) {
      baseQuery = baseQuery.where('media.type', '=', criteria.type)
    }

    if (criteria.mime) {
      baseQuery = baseQuery.where('media.mime', '=', criteria.mime)
    }

    const results = await baseQuery
      .selectAll()
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const countQuery = this.db
      .selectFrom('media')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', ['media.url']),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(typeof criteria.isDownloadable === 'boolean', (qb) =>
        qb.where('media.isDownloadable', '=', criteria.isDownloadable!),
      )
      .$if(!!criteria.type, (qb) => qb.where('media.type', '=', criteria.type!))
      .$if(!!criteria.mime, (qb) => qb.where('media.mime', '=', criteria.mime!))
      .select(({ fn }) => fn.count<number>('media.id').as('total'))

    const totalRow = await countQuery.executeTakeFirstOrThrow()

    return processPagination({
      results,
      total: totalRow!.total,
      page: pageable.page,
      size: pageable.size,
    })
  }

  async getById(id: string): Promise<Media | undefined> {
    return await this.db
      .selectFrom('media')
      .where('media.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async getByUrl(url: MediaUrl): Promise<Media | undefined> {
    return await this.db
      .selectFrom('media')
      .where('media.url', '=', url)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewMedia): Promise<InsertResult> {
    return await this.db.insertInto('media').values(data).executeTakeFirst()
  }

  async updateById(id: string, data: UpdateMedia): Promise<UpdateResult> {
    return await this.db
      .updateTable('media')
      .set(data)
      .where('media.id', '=', id)
      .executeTakeFirst()
  }

  async updateByUrl(url: MediaUrl, data: UpdateMedia): Promise<UpdateResult> {
    return await this.db
      .updateTable('media')
      .set(data)
      .where('media.url', '=', url)
      .executeTakeFirst()
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('media').where('media.id', '=', id).executeTakeFirst()
  }

  async deleteByUrl(url: MediaUrl): Promise<DeleteResult> {
    return await this.db.deleteFrom('media').where('media.url', '=', url).executeTakeFirst()
  }
}
