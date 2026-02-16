'use server'

import { z } from 'zod'
import { cacheLife, cacheTag } from 'next/cache'
import db from '@/lib/db'
import { MediaService } from '@/services/MediaService'
import type { MediaCriteria } from '@/repository/MediaRepository'
import type { PaginationRequest } from '@/repository/_contracts'
import {
  base64schema,
  handleServerActionError,
  idschema,
  type ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { Base64Utils } from '@/lib/base64'
import { MediaType, MediaTypeFactory } from '@/schemas/MediaTable'
import { NodeIOAdapter } from '@/lib/io'
import { getSessionThrowable } from './_resource-access'

const createMediaSchema = z.object({
  file: base64schema,
  altText: z.string().max(255).optional(),
  isDownloadable: z.boolean().optional(),
})

const updateMediaSchema = z
  .object({
    altText: z.string().max(255).optional(),
    isDownloadable: z.boolean().optional(),
    type: z.nativeEnum(MediaType).optional(),
  })
  .partial()
  .extend({ id: idschema })

export type CreateMediaInput = z.infer<typeof createMediaSchema>
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>

export async function getMedia(criteria: MediaCriteria, pageable: PaginationRequest) {
  // 'use cache'
  // cacheTag('media')
  // cacheLife('hours')

  const service = new MediaService(db)
  return service.getMedia(criteria, pageable)
}

export async function getMediaById(id: string) {
  // 'use cache'
  // cacheTag('mediaById', id)
  // cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const service = new MediaService(db)
  return service.getMediaById(parsedId)
}

export async function getMediaByUrl(url: string) {
  // 'use cache'
  // cacheTag('mediaByUrl', url)
  // cacheLife('hours')

  const service = new MediaService(db)
  return service.getMediaUploadUrl(url)
}

export async function createMedia(input: CreateMediaInput): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(createMediaSchema, input)

    const base64utils = new Base64Utils()
    const file = await base64utils.parseBase64(parsed.file, { filename: 'media' })

    const io = new NodeIOAdapter()
    const url = await io.write(file)

    const service = new MediaService(db)
    await service.createMedia({
      url,
      mime: file.type,
      type: MediaTypeFactory.fromMimeType(file.type),
      altText: parsed.altText,
      isDownloadable: parsed.isDownloadable ?? false,
    })

    // updateTag('media')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateMedia(input: UpdateMediaInput): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(updateMediaSchema, input)
    const { id, ...payload } = parsed

    const service = new MediaService(db)
    await service.updateMediaById(id, payload)

    // updateTag('media')
    // updateTag('mediaById')
    // updateTag(id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteMedia(id: string): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsedId = validateInput(idschema, id)

    const service = new MediaService(db)
    await service.deleteMediaById(parsedId)

    // updateTag('media')
    // updateTag('mediaById')
    // updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
