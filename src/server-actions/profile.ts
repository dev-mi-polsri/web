'use server'

import { z } from 'zod'
import { cacheLife, cacheTag } from 'next/cache'
import db from '@/lib/db'
import { ProfileService } from '@/services/ProfileService'
import type { ProfileCriteria } from '@/repository/ProfileRepository'
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
import { getSessionThrowable } from './_resource-access'

const slugSchema = z
  .string()
  .min(1, 'Slug tidak boleh kosong')
  .max(255, 'Slug maksimal 255 karakter')

const profileSchema = z.object({
  thumbnail: base64schema,
  title: z.string().min(3, 'Judul minimal 3 karakter').max(255),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(5000),
  content: richtextschema,
  scope: z.enum(PostScope),
})

const createProfileSchema = profileSchema
const updateProfileSchema = profileSchema.partial().extend({ id: idschema })

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export async function getProfile(criteria: ProfileCriteria, pageable: PaginationRequest) {
  // 'use cache'
  // cacheTag('profile')
  // cacheLife('hours')

  const service = new ProfileService(db)
  return service.getProfile(criteria, pageable)
}

export async function getProfileById(id: string) {
  // 'use cache'
  // cacheTag('profileById', id)
  // cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const service = new ProfileService(db)
  return service.getProfileById(parsedId)
}

export async function getProfileBySlug(slug: string) {
  // 'use cache'
  // cacheTag('profileBySlug', slug)
  // cacheLife('hours')

  const parsedSlug = validateInput(slugSchema, slug)

  const service = new ProfileService(db)
  return service.getProfileBySlug(parsedSlug)
}

export async function createProfile(
  input: CreateProfileInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(createProfileSchema, input)

    const base64utils = new Base64Utils()
    const thumbnail = await base64utils.parseBase64(parsed.thumbnail, {
      filename: 'profile-thumbnail',
    })

    const service = new ProfileService(db)
    await service.createProfile({
      ...parsed,
      thumbnail,
      content: JSON.stringify(parsed.content),
      slug: PostUtility.generateSlug({ createdAt: new Date(), title: parsed.title }),
    })

    // updateTag('profile')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(updateProfileSchema, input)

    let thumbnail: File | undefined
    if (parsed.thumbnail) {
      const base64utils = new Base64Utils()
      thumbnail = await base64utils.parseBase64(parsed.thumbnail, { filename: 'profile-thumbnail' })
    }

    const service = new ProfileService(db)
    await service.updateProfile(parsed.id, {
      ...parsed,
      thumbnail,
      content: JSON.stringify(parsed.content),
    })

    // updateTag('profile')
    // updateTag('profileById')
    // updateTag(parsed.id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteProfile(id: string): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedId = validateInput(idschema, id)

    const service = new ProfileService(db)
    await service.deleteProfile(parsedId)

    // updateTag('profile')
    // updateTag('profileById')
    // updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
