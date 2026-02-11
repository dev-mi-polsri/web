import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Database } from '@/lib/db'
import { FileIO, NodeFileIO } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'
import { NewProdi, Prodi, UpdateProdi } from '@/schemas/ProdiTable'
import { PostScope } from '@/schemas/_common'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type ProdiCriteria = {
  searchKeyword?: string
  scope?: PostScope
  slug?: string
}

export interface IProdiRepository {
  getAll(criteria: ProdiCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Prodi>>
  getById(id: string): Promise<Prodi | undefined>
  getBySlug(slug: string): Promise<Prodi | undefined>
  create(data: NewProdi): Promise<InsertResult>
  update(id: string, data: UpdateProdi): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class ProdiRepository implements IProdiRepository {
  private db: Kysely<Database>
  private io: FileIO

  constructor(database: Kysely<Database>, io?: FileIO) {
    this.db = database
    this.io = io ?? new NodeFileIO()
  }

  async getAll(
    criteria: ProdiCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Prodi>> {
    let query = this.db.selectFrom('prodi')

    if (criteria.searchKeyword) {
      query = query.where(
        (eb) => eb.fn('lower', ['prodi.title']),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }
    if (criteria.scope) query = query.where('prodi.scope', '=', criteria.scope)
    if (criteria.slug) query = query.where('prodi.slug', '=', criteria.slug)

    const results = await query
      .selectAll()
      .orderBy('prodi.createdAt', 'desc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('prodi')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', ['prodi.title']),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.scope, (qb) => qb.where('prodi.scope', '=', criteria.scope!))
      .$if(!!criteria.slug, (qb) => qb.where('prodi.slug', '=', criteria.slug!))
      .select(({ fn }) => fn.count<number>('prodi.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...totalRow,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<Prodi | undefined> {
    return await this.db
      .selectFrom('prodi')
      .where('prodi.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async getBySlug(slug: string): Promise<Prodi | undefined> {
    return await this.db
      .selectFrom('prodi')
      .where('prodi.slug', '=', slug)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewProdi): Promise<InsertResult> {
    const uploadedFilePath = await this.io.write(data.thumbnail)
    const { thumbnail: _thumbnail, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: data.thumbnail.type,
        })
        .executeTakeFirst()

      return await trx
        .insertInto('prodi')
        .values({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async update(id: string, data: UpdateProdi): Promise<UpdateResult> {
    if (!data.thumbnail) {
      const { thumbnail: _thumbnail, ...rest } = data
      return await this.db
        .updateTable('prodi')
        .set(rest)
        .where('prodi.id', '=', id)
        .executeTakeFirst()
    }

    const uploadedFilePath = await this.io.write(data.thumbnail)
    const { thumbnail: _thumbnail, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: data.thumbnail!.type,
        })
        .executeTakeFirst()

      return await trx
        .updateTable('prodi')
        .set({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .where('prodi.id', '=', id)
        .executeTakeFirst()
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('prodi').where('prodi.id', '=', id).executeTakeFirst()
  }
}
