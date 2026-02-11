import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Database } from '@/lib/db'
import { FileIO, NodeFileIO } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'
import { NewProfile, Profile, UpdateProfile } from '@/schemas/ProfileTable'
import { PostScope } from '@/schemas/_common'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type ProfileCriteria = {
  searchKeyword?: string
  scope?: PostScope
  slug?: string
}

export interface IProfileRepository {
  getAll(criteria: ProfileCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Profile>>
  getById(id: string): Promise<Profile | undefined>
  getBySlug(slug: string): Promise<Profile | undefined>
  create(data: NewProfile): Promise<InsertResult>
  update(id: string, data: UpdateProfile): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class ProfileRepository implements IProfileRepository {
  private db: Kysely<Database>
  private io: FileIO

  constructor(database: Kysely<Database>, io?: FileIO) {
    this.db = database
    this.io = io ?? new NodeFileIO()
  }

  async getAll(
    criteria: ProfileCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Profile>> {
    let query = this.db.selectFrom('profile')

    if (criteria.searchKeyword) {
      query = query.where(
        (eb) => eb.fn('lower', ['profile.title']),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }
    if (criteria.scope) query = query.where('profile.scope', '=', criteria.scope)
    if (criteria.slug) query = query.where('profile.slug', '=', criteria.slug)

    const results = await query
      .selectAll()
      .orderBy('profile.createdAt', 'desc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('profile')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', ['profile.title']),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.scope, (qb) => qb.where('profile.scope', '=', criteria.scope!))
      .$if(!!criteria.slug, (qb) => qb.where('profile.slug', '=', criteria.slug!))
      .select(({ fn }) => fn.count<number>('profile.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...totalRow,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<Profile | undefined> {
    return await this.db
      .selectFrom('profile')
      .where('profile.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async getBySlug(slug: string): Promise<Profile | undefined> {
    return await this.db
      .selectFrom('profile')
      .where('profile.slug', '=', slug)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewProfile): Promise<InsertResult> {
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
        .insertInto('profile')
        .values({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async update(id: string, data: UpdateProfile): Promise<UpdateResult> {
    if (!data.thumbnail) {
      const { thumbnail: _thumbnail, ...rest } = data
      return await this.db
        .updateTable('profile')
        .set(rest)
        .where('profile.id', '=', id)
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
        .updateTable('profile')
        .set({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .where('profile.id', '=', id)
        .executeTakeFirst()
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('profile').where('profile.id', '=', id).executeTakeFirst()
  }
}
