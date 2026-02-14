import { PostCriteria, PostRepository, TagRepository } from '@/repository/PostRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { NewPost, Post, PostSummary, PostWithTags, Tag, UpdatePost } from '@/schemas/PostTable'
import type { Database } from '@/lib/db'
import type { IOAdapter } from '@/lib/io'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from '@/services/_common'

export interface IPostService {
  getPost(
    criteria: PostCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<PostSummary>>
  getByTag(tagId: string, pageable?: PaginationRequest): Promise<PaginatedResult<PostSummary>>
  getPostById(id: string): Promise<Post>
  getPostBySlug(slug: string): Promise<Post>
  createPost(data: NewPost): Promise<boolean>
  updatePost(id: string, data: UpdatePost): Promise<boolean>
  deletePost(id: string): Promise<boolean>
  removeTag(postId: string, tagId: string): Promise<void>
}

export interface ITagService {
  getTags(): Promise<Tag[]>
  getTagById(id: string): Promise<Tag>
  getTagBySlug(slug: string): Promise<Tag>
  createTag(name: string): Promise<void>
  deleteTag(id: string): Promise<void>
}

export class PostNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'POST_NOT_FOUND', 404)
    this.name = 'PostNotFoundError'
  }
}

export class PostService implements IPostService {
  private repository: PostRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new PostRepository(db, io)
  }

  async getPost(
    criteria: PostCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<PostSummary>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getPostById(id: string): Promise<PostWithTags> {
    const post = await this.repository.getById(id)
    if (!post) {
      throw new PostNotFoundError(`Post with id ${id} not found`)
    }
    return post
  }

  async getByTag(
    tagId: string,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<PostSummary>> {
    return await this.repository.getByTag(tagId, normalizePagination(pageable))
  }

  async getPostBySlug(slug: string): Promise<PostWithTags> {
    const post = await this.repository.getBySlug(slug)
    if (!post) {
      throw new PostNotFoundError(`Post with slug ${slug} not found`)
    }
    return post
  }

  async createPost(data: NewPost): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async updatePost(id: string, data: UpdatePost): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }

  async deletePost(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }

  async removeTag(postId: string, tagId: string): Promise<void> {
    await this.repository.removeTag(postId, tagId)
  }
}

export class TagService implements ITagService {
  private repository: TagRepository

  constructor(db: Kysely<Database>) {
    this.repository = new TagRepository(db)
  }

  async getTags(): Promise<Tag[]> {
    return await this.repository.getAll()
  }

  async getTagById(id: string): Promise<Tag> {
    const tag = await this.repository.getById(id)
    if (!tag) {
      throw new ServiceError(`Tag with id ${id} not found`, 'TAG_NOT_FOUND', 404)
    }

    return tag
  }

  async getTagBySlug(slug: string): Promise<Tag> {
    const tag = await this.repository.getBySlug(slug)
    if (!tag) {
      throw new ServiceError(`Tag with slug ${slug} not found`, 'TAG_NOT_FOUND', 404)
    }

    return tag
  }

  async createTag(name: string): Promise<void> {
    await this.repository.create(name)
  }

  async deleteTag(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
