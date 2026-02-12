'use server'

import { z } from 'zod'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import db from '@/lib/db'
import { ProdiService } from '@/services/ProdiService'
import type { ProdiCriteria } from '@/repository/ProdiRepository'
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
import { PostScope } from '@/schemas/_common'
import { PostUtility } from '@/schemas/PostTable'

const slugSchema = z
  .string()
  .min(1, 'Slug tidak boleh kosong')
  .max(255, 'Slug maksimal 255 karakter')

const prodiSchema = z.object({
  thumbnail: base64schema,
  title: z.string().min(3, 'Judul minimal 3 karakter').max(255),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(5000),
  content: richtextschema,
  scope: z.enum(PostScope),
})

const createProdiSchema = prodiSchema
const updateProdiSchema = prodiSchema.partial().extend({ id: idschema })

export type CreateProdiInput = z.infer<typeof createProdiSchema>
export type UpdateProdiInput = z.infer<typeof updateProdiSchema>

export async function getProdi(criteria: ProdiCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheTag('prodi')
  cacheLife('hours')

  const service = new ProdiService(db)
  return service.getProdi(criteria, pageable)
}

export async function getProdiById(id: string) {
  'use cache'
  cacheTag('prodiById', id)
  cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const service = new ProdiService(db)
  return service.getProdiById(parsedId)
}

export async function getProdiBySlug(slug: string) {
  'use cache'
  cacheTag('prodiBySlug', slug)
  cacheLife('hours')

  const parsedSlug = validateInput(slugSchema, slug)

  const service = new ProdiService(db)
  return service.getProdiBySlug(parsedSlug)
}

export async function createProdi(input: CreateProdiInput): Promise<ServerActionResponse<void>> {
  try {
    const parsed = validateInput(createProdiSchema, input)

    const base64utils = new Base64Utils()
    const thumbnail = await base64utils.parseBase64(parsed.thumbnail, {
      filename: 'prodi-thumbnail',
    })

    const service = new ProdiService(db)
    await service.createProdi({
      ...parsed,
      slug: PostUtility.generateSlug({ createdAt: new Date(), title: parsed.title }),
      thumbnail,
    })

    updateTag('prodi')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateProdi(input: UpdateProdiInput): Promise<ServerActionResponse<void>> {
  try {
    const parsed = validateInput(updateProdiSchema, input)

    let thumbnail: File | undefined
    if (parsed.thumbnail) {
      const base64utils = new Base64Utils()
      thumbnail = await base64utils.parseBase64(parsed.thumbnail, { filename: 'prodi-thumbnail' })
    }

    const service = new ProdiService(db)
    await service.updateProdi(parsed.id, {
      ...parsed,
      thumbnail,
    })

    updateTag('prodi')
    updateTag('prodiById')
    updateTag(parsed.id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteProdi(id: string): Promise<ServerActionResponse<void>> {
  try {
    const parsedId = validateInput(idschema, id)

    const service = new ProdiService(db)
    await service.deleteProdi(parsedId)

    updateTag('prodi')
    updateTag('prodiById')
    updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
