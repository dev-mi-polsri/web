'use server'

import { z } from 'zod'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import db from '@/lib/db'
import { PostService, TagService } from '@/services/PostService'
import type { PostCriteria } from '@/repository/PostRepository'
import type { PaginationRequest } from '@/repository/_contracts'
import {
  base64schema,
  handleServerActionError,
  idschema,
  richtextschema,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { Base64Utils } from '@/lib/base64'
import { PostType, PostUtility } from '@/schemas/PostTable'
import { PostScope } from '@/schemas/_common'

const postSchema = z.object({
  thumbnail: base64schema,
  title: z.string().min(10, 'Judul setidaknya terdiri dari 10 karakter').max(255),
  content: richtextschema,
  type: z.nativeEnum(PostType),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  scope: z.nativeEnum(PostScope),
  tagIds: z.array(idschema).optional(),
})

const createPostSchema = postSchema
const updatePostSchema = postSchema.partial().extend({ id: idschema })

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>

export async function getPost(criteria: PostCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheTag('post')
  cacheLife('hours')

  const service = new PostService(db)
  return service.getPost(criteria, pageable)
}

export async function getPostById(id: string) {
  'use cache'
  cacheTag('postById', id)
  cacheLife('hours')

  const service = new PostService(db)
  return service.getPostById(id)
}

export async function getPostByTag(tagId: string, pageable: PaginationRequest) {
  'use cache'
  cacheTag('postByTag', tagId)
  cacheLife('hours')

  const service = new PostService(db)
  return service.getByTag(tagId, pageable)
}

export async function getPostBySlug(slug: string) {
  'use cache'
  cacheTag('postBySlug', slug)
  cacheLife('hours')

  const service = new PostService(db)
  return service.getPostBySlug(slug)
}

export async function getTags() {
  'use cache'
  cacheTag('tags')
  cacheLife('hours')

  const service = new TagService(db)
  return service.getTags()
}

export async function getTagById(id: string) {
  'use cache'
  cacheTag('tagById', id)
  cacheLife('hours')

  const service = new TagService(db)
  return service.getTagById(id)
}

export async function createTag(name: string): Promise<ServerActionResponse<void>> {
  try {
    const service = new TagService(db)
    await service.createTag(name)
    updateTag('tags')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteTag(id: string): Promise<ServerActionResponse<void>> {
  try {
    const service = new TagService(db)
    await service.deleteTag(id)
    updateTag('tags')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function createPost(input: CreatePostInput): Promise<ServerActionResponse<void>> {
  try {
    const parsed = validateInput(createPostSchema, input)

    const base64utils = new Base64Utils()
    const thumbnail = await base64utils.parseBase64(parsed.thumbnail)

    const service = new PostService(db)
    await service.createPost({
      title: parsed.title,
      content: JSON.stringify(parsed.content),
      type: parsed.type,
      scope: parsed.scope,
      thumbnail,
      slug: PostUtility.generateSlug({ createdAt: new Date(), title: parsed.title }),
      isFeatured: parsed.isFeatured ?? false,
      isPublished: parsed.isPublished ?? false,
      tagIds: parsed.tagIds,
    })

    updateTag('post')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updatePost(input: UpdatePostInput): Promise<ServerActionResponse<void>> {
  try {
    const parsed = validateInput(updatePostSchema, input)

    let thumbnail: File | undefined
    if (parsed.thumbnail) {
      const base64utils = new Base64Utils()
      thumbnail = await base64utils.parseBase64(parsed.thumbnail, { filename: 'post-thumbnail' })
    }

    const service = new PostService(db)
    await service.updatePost(parsed.id, {
      title: parsed.title,
      content: JSON.stringify(parsed.content),
      type: parsed.type,
      scope: parsed.scope,
      isFeatured: parsed.isFeatured,
      isPublished: parsed.isPublished,
      tagIds: parsed.tagIds,
      thumbnail,
    })

    updateTag('post')
    updateTag('postById')
    updateTag(parsed.id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deletePost(id: string): Promise<ServerActionResponse<void>> {
  try {
    const parsedId = validateInput(idschema, id)

    const service = new PostService(db)
    await service.deletePost(parsedId)

    updateTag('post')
    updateTag('postById')
    updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function removeTagFromPost(
  postId: string,
  tagId: string,
): Promise<ServerActionResponse<void>> {
  try {
    const parsedPostId = validateInput(idschema, postId)
    const parsedTagId = validateInput(idschema, tagId)

    const service = new PostService(db)
    await service.removeTag(parsedPostId, parsedTagId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
