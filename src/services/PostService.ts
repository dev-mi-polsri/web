import { PostCriteria, PostRepository } from '@/repository/PostRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { NewPost, Post, UpdatePost } from '@/schemas/PostTable'
import type { Database } from '@/lib/db'
import type { IOAdapter } from '@/lib/io'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface IPostService {
  getPost(criteria: PostCriteria, pageable?: PaginationRequest): Promise<PaginatedResult<Post>>
  getPostById(id: string): Promise<Post>
  getPostBySlug(slug: string): Promise<Post>
  createPost(data: NewPost): Promise<boolean>
  updatePost(id: string, data: UpdatePost): Promise<boolean>
  deletePost(id: string): Promise<boolean>
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

  async getPost(criteria: PostCriteria, pageable?: PaginationRequest): Promise<PaginatedResult<Post>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.repository.getById(id)
    if (!post) {
      throw new PostNotFoundError(`Post with id ${id} not found`)
    }
    return post
  }

  async getPostBySlug(slug: string): Promise<Post> {
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
}
