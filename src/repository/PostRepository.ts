import { PaginatedResult, PaginationRequest, processPagination } from '@/repository/_common'
import { Database } from '@/lib/db'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'
import {
  NewPost,
  Post,
  PostSummary,
  PostType,
  PostUtility,
  PostWithTags,
  Tag,
  UpdatePost,
} from '@/schemas/PostTable'
import { JsonValue, PostScope } from '@/schemas/_common'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/mysql'

function parseTagsJson(tagsJson: unknown): Tag[] {
  if (!tagsJson) return []
  if (Array.isArray(tagsJson)) return tagsJson as Tag[]

  if (typeof tagsJson === 'string') {
    try {
      const parsed = JSON.parse(tagsJson) as unknown
      return Array.isArray(parsed) ? (parsed as Tag[]) : []
    } catch {
      return []
    }
  }

  return []
}

export type PostCriteria = {
  searchKeyword?: string
  type?: PostType
  scope?: PostScope
  isFeatured?: boolean
  isPublished?: boolean
}

export interface IPostRepository {
  getAll(criteria: PostCriteria, pageable: PaginationRequest): Promise<PaginatedResult<PostSummary>>
  getByTag(tagId: string, pageable: PaginationRequest): Promise<PaginatedResult<PostSummary>>
  getById(id: string): Promise<PostWithTags | undefined>
  getBySlug(slug: string): Promise<PostWithTags | undefined>
  create(data: NewPost): Promise<InsertResult>
  update(id: string, data: UpdatePost): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
  removeTag(postId: string, tagId: string): Promise<void>
}

export interface ITagRepository {
  getAll(): Promise<Tag[]>
  getById(id: string): Promise<Tag | undefined>
  getBySlug(slug: string): Promise<Tag | undefined>
  create(name: string): Promise<void> // returns new tag ID
  delete(id: string): Promise<void>
}

export class PostRepository implements IPostRepository {
  private db: Kysely<Database>
  private io: IOAdapter

  constructor(database: Kysely<Database>, io?: IOAdapter) {
    this.db = database
    this.io = io ?? new NodeIOAdapter()
  }

  async getAll(
    criteria: PostCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<PostSummary>> {
    let baseQuery = this.db.selectFrom('post')

    if (criteria.searchKeyword) {
      baseQuery = baseQuery.where(
        (eb) => eb.fn('lower', ['post.title']),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }
    if (criteria.type) baseQuery = baseQuery.where('post.type', '=', criteria.type)
    if (criteria.scope) baseQuery = baseQuery.where('post.scope', '=', criteria.scope)
    if (typeof criteria.isFeatured === 'boolean')
      baseQuery = baseQuery.where('post.isFeatured', '=', criteria.isFeatured)
    if (typeof criteria.isPublished === 'boolean')
      baseQuery = baseQuery.where('post.isPublished', '=', criteria.isPublished)

    const rows = await baseQuery
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.thumbnail',
        'post.createdAt',
        'post.isPublished',
        'post.scope',
        'post.isFeatured',
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('postTag as pt')
            .innerJoin('tag as t', 't.id', 'pt.tagId')
            .select(['t.id', 't.name', 't.slug'])
            .whereRef('pt.postId', '=', 'post.id'),
        ).as('tags'),
      ])
      .orderBy('post.createdAt', 'desc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const results: PostSummary[] = rows.map((row) => ({
      ...(row as Omit<PostSummary, 'tags'> & { tags: unknown }),
      tags: parseTagsJson((row as { tags: unknown }).tags),
    }))

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
      .$if(typeof criteria.isPublished === 'boolean', (qb) =>
        qb.where('post.isPublished', '=', criteria.isPublished!),
      )
      .select(({ fn }) => fn.count<number>('post.id').as('total'))
      .executeTakeFirstOrThrow()

    return processPagination({
      results,
      total: totalRow!.total,
      page: pageable.page,
      size: pageable.size,
    })
  }

  async getByTag(
    tagId: string,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<PostSummary>> {
    const baseQuery = this.db
      .selectFrom('post')
      .innerJoin('postTag as pt', 'post.id', 'pt.postId')
      .where('pt.tagId', '=', tagId)

    const rows = await baseQuery
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.thumbnail',
        'post.createdAt',
        'post.isPublished',
        'post.scope',
        'post.isFeatured',
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('postTag as pt2')
            .innerJoin('tag as t', 't.id', 'pt2.tagId')
            .select(['t.id', 't.name', 't.slug'])
            .whereRef('pt2.postId', '=', 'post.id'),
        ).as('tags'),
      ])
      .orderBy('post.createdAt', 'desc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const results: PostSummary[] = rows.map((row) => ({
      ...(row as Omit<PostSummary, 'tags'> & { tags: unknown }),
      tags: parseTagsJson((row as { tags: unknown }).tags),
    }))

    const totalRow = await this.db
      .selectFrom('post')
      .innerJoin('postTag as pt', 'post.id', 'pt.postId')
      .where('pt.tagId', '=', tagId)
      .select(({ fn }) => fn.count<number>('post.id').as('total'))
      .executeTakeFirstOrThrow()

    return processPagination({
      results,
      total: totalRow!.total,
      page: pageable.page,
      size: pageable.size,
    })
  }

  async getById(id: string): Promise<PostWithTags | undefined> {
    return await this.db
      .selectFrom('post')
      .where('post.id', '=', id)
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.type',
        'post.thumbnail',
        'post.isFeatured',
        'post.createdAt',
        'post.isPublished',
        'post.scope',
        'post.isFeatured',
        'post.content',
        'post.updatedAt',
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('postTag as pt2')
            .innerJoin('tag as t', 't.id', 'pt2.tagId')
            .select(['t.id', 't.name', 't.slug'])
            .whereRef('pt2.postId', '=', 'post.id'),
        ).as('tags'),
      ])
      .executeTakeFirst()
  }

  async getBySlug(slug: string): Promise<PostWithTags | undefined> {
    return await this.db
      .selectFrom('post')
      .where('post.slug', '=', slug)
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.type',
        'post.thumbnail',
        'post.isFeatured',
        'post.createdAt',
        'post.isPublished',
        'post.scope',
        'post.isFeatured',
        'post.content',
        'post.updatedAt',
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('postTag as pt2')
            .innerJoin('tag as t', 't.id', 'pt2.tagId')
            .select(['t.id', 't.name', 't.slug'])
            .whereRef('pt2.postId', '=', 'post.id'),
        ).as('tags'),
      ])
      .executeTakeFirst()
  }

  async create(data: NewPost): Promise<InsertResult> {
    const uploadedFilePath = await this.io.write(data.thumbnail)
    const { thumbnail: _thumbnail, tagIds, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: data.thumbnail.type,
          isDownloadable: false,
        })
        .executeTakeFirst()

      const insertResult = await trx
        .insertInto('post')
        .values({
          ...rest,
          content: new JsonValue(data.content),
          thumbnail: uploadedFilePath,
        })
        .executeTakeFirst()

      if (tagIds && tagIds.length > 0) {
        // We fetch the post ID by slug to avoid relying on INSERT RETURNING in MySQL.
        const insertedPost = await trx
          .selectFrom('post')
          .select(['post.id'])
          .where('post.slug', '=', rest.slug)
          .executeTakeFirstOrThrow()

        await trx
          .insertInto('postTag')
          .values(tagIds.map((id) => ({ postId: insertedPost.id, tagId: id })))
          .execute()
      }

      return insertResult
    })
  }

  async update(id: string, data: UpdatePost): Promise<UpdateResult> {
    const { thumbnail: _thumbnail, tagIds, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      let updateResult: UpdateResult

      if (!data.thumbnail) {
        updateResult = await trx
          .updateTable('post')
          .set(rest)
          .where('post.id', '=', id)
          .executeTakeFirst()
      } else {
        const uploadedFilePath = await this.io.write(data.thumbnail)

        await trx
          .insertInto('media')
          .values({
            url: uploadedFilePath,
            type: MediaType.IMAGE,
            mime: data.thumbnail.type,
            isDownloadable: false,
          })
          .executeTakeFirst()

        updateResult = await trx
          .updateTable('post')
          .set({
            ...rest,
            thumbnail: uploadedFilePath,
          })
          .where('post.id', '=', id)
          .executeTakeFirst()
      }

      if (tagIds) {
        await trx.deleteFrom('postTag').where('postTag.postId', '=', id).execute()
        if (tagIds.length > 0) {
          await trx
            .insertInto('postTag')
            .values(tagIds.map((tagId) => ({ postId: id, tagId })))
            .execute()
        }
      }

      return updateResult
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('post').where('post.id', '=', id).executeTakeFirst()
  }

  async removeTag(postId: string, tagId: string): Promise<void> {
    await this.db
      .deleteFrom('postTag')
      .where('postTag.postId', '=', postId)
      .where('postTag.tagId', '=', tagId)
      .execute()
  }
}

export class TagRepository implements ITagRepository {
  private db: Kysely<Database>

  constructor(database: Kysely<Database>) {
    this.db = database
  }

  async getAll(): Promise<Tag[]> {
    return await this.db.selectFrom('tag').selectAll().execute()
  }

  async getById(id: string): Promise<Tag | undefined> {
    return await this.db.selectFrom('tag').where('tag.id', '=', id).selectAll().executeTakeFirst()
  }

  async create(name: string): Promise<void> {
    const slug = PostUtility.generateTagSlug({ name })

    await this.db.insertInto('tag').values({ name, slug }).executeTakeFirst()
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom('tag').where('tag.id', '=', id).execute()
  }

  async getBySlug(slug: string): Promise<Tag | undefined> {
    return await this.db
      .selectFrom('tag')
      .where('tag.slug', '=', slug)
      .selectAll()
      .executeTakeFirst()
  }
}
