'use server'

import { z } from 'zod'
import { cacheLife, cacheTag } from 'next/cache'
import db from '@/lib/db'
import type { PaginationRequest } from '@/repository/_contracts'
import type { DokumenCriteria } from '@/repository/DokumenRepository'
import { DokumenService } from '@/services/DokumenService'
import {
  base64schema,
  handleServerActionError,
  idschema,
  type ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { Base64Utils } from '@/lib/base64'
import { getSessionThrowable } from './_resource-access'

const dokumenSchema = z.object({
  file: base64schema,
  name: z
    .string()
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Jumlah maksimum untuk nama adalah 255 karakter'),
  enName: z
    .string()
    .min(1, 'Nama (English) tidak boleh kosong')
    .max(255, 'Jumlah maksimum untuk nama (English) adalah 255 karakter'),
})

const createDokumenSchema = dokumenSchema
const updateDokumenSchema = dokumenSchema.partial().extend({ id: idschema })

export type CreateDokumenInput = z.infer<typeof createDokumenSchema>
export type UpdateDokumenInput = z.infer<typeof updateDokumenSchema>

export async function getDokumenById(id: string) {
  // 'use cache'
  // cacheTag('dokumenById', id)
  // cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const dokumenService = new DokumenService(db)
  return dokumenService.getDokumenById(parsedId)
}

export async function getDokumen(criteria: DokumenCriteria, pageable: PaginationRequest) {
  // 'use cache'
  // cacheTag('dokumen')
  // cacheLife('hours')

  const dokumenService = new DokumenService(db)
  return dokumenService.getDokumen(criteria, pageable)
}

export async function createDokumen(
  input: CreateDokumenInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable()
    const parsed = validateInput(createDokumenSchema, input)

    const base64utils = new Base64Utils()
    const file = await base64utils.parseBase64(parsed.file, { filename: 'dokumen' })

    const service = new DokumenService(db)
    await service.createDokumen({
      file,
      name: parsed.name,
      enName: parsed.enName,
    })

    // updateTag('dokumen')
  } catch (e) {
    return handleServerActionError(e)
  }
}

export async function updateDokumen(
  input: UpdateDokumenInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable()

    const parsed = validateInput(updateDokumenSchema, input)

    let file: File | undefined
    if (parsed.file) {
      const base64utils = new Base64Utils()
      file = await base64utils.parseBase64(parsed.file, { filename: 'dokumen' })
    }

    const service = new DokumenService(db)
    await service.updateDokumen(parsed.id, {
      file,
      name: parsed.name,
      enName: parsed.enName,
    })

    // updateTag('dokumen')
    // updateTag('dokumenById')
    // updateTag(parsed.id)
  } catch (e) {
    return handleServerActionError(e)
  }
}

export async function deleteDokumen(id: string): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable()

    const parsedId = validateInput(idschema, id)

    const service = new DokumenService(db)
    await service.deleteDokumen(parsedId)

    // updateTag('dokumen')
    // updateTag('dokumenById')
    // updateTag(parsedId)
  } catch (e) {
    return handleServerActionError(e)
  }
}
