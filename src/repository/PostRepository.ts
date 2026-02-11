import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Database } from '@/lib/db'
import { FileIO, NodeFileIO } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'
import { NewPost, Post, PostType, UpdatePost } from '@/schemas/PostTable'
import { PostScope } from '@/schemas/_common'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type PostCriteria = {
  searchKeyword?: string
  type?: PostType
  scope?: PostScope
  isFeatured?: boolean
}

export interface IPostRepository {
  getAll(criteria: PostCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Post>>
  getById(id: string): Promise<Post | undefined>
  getBySlug(slug: string): Promise<Post | undefined>
  create(data: NewPost): Promise<InsertResult>
  update(id: string, data: UpdatePost): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class PostRepository implements IPostRepository {
  private db: Kysely<Database>
  private io: FileIO

  constructor(database: Kysely<Database>, io?: FileIO) {
    this.db = database
    this.io = io ?? new NodeFileIO()
  }

  async getAll(
    criteria: PostCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Post>> {
    let query = this.db.selectFrom('post')

    if (criteria.searchKeyword) {
      query = query.where(
        (eb) => eb.fn('lower', ['post.title']),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }
    if (criteria.type) query = query.where('post.type', '=', criteria.type)
    if (criteria.scope) query = query.where('post.scope', '=', criteria.scope)
    if (typeof criteria.isFeatured === 'boolean')
      query = query.where('post.isFeatured', '=', criteria.isFeatured)

    const results = await query
      .selectAll()
      .orderBy('post.createdAt', 'desc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('post')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', ['post.title']),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.type, (qb) => qb.where('post.type', '=', criteria.type!))
      .$if(!!criteria.scope, (qb) => qb.where('post.scope', '=', criteria.scope!))
      .$if(typeof criteria.isFeatured === 'boolean', (qb) =>
        qb.where('post.isFeatured', '=', criteria.isFeatured!),
      )
      .select(({ fn }) => fn.count<number>('post.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...totalRow,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<Post | undefined> {
    return await this.db.selectFrom('post').where('post.id', '=', id).selectAll().executeTakeFirst()
  }

  async getBySlug(slug: string): Promise<Post | undefined> {
    return await this.db
      .selectFrom('post')
      .where('post.slug', '=', slug)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewPost): Promise<InsertResult> {
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
        .insertInto('post')
        .values({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async update(id: string, data: UpdatePost): Promise<UpdateResult> {
    if (!data.thumbnail) {
      const { thumbnail: _thumbnail, ...rest } = data
      return await this.db
        .updateTable('post')
        .set(rest)
        .where('post.id', '=', id)
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
        .updateTable('post')
        .set({
          ...rest,
          thumbnail: uploadedFilePath,
        })
        .where('post.id', '=', id)
        .executeTakeFirst()
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('post').where('post.id', '=', id).executeTakeFirst()
  }
}
