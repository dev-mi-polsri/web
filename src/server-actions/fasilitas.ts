'use server'
import { z } from 'zod'
import {
  base64schema,
  handleServerActionError,
  idschema,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { Base64Utils } from '@/lib/base64'
import { FasilitasService } from '@/services/FasilitasService'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import db from '@/lib/db'
import type { FasilitasCriteria } from '@/repository/FasilitasRepository'
import type { PaginationRequest } from '@/repository/_contracts'
import { getSessionThrowable } from './_resource-access'

const fasilitasSchema = z.object({
  image: base64schema,
  name: z
    .string()
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Jumlah maksimum untuk nama adalah 255 karakter'),
  enName: z
    .string()
    .min(1, 'Nama (English) tidak boleh kosong')
    .max(255, 'Jumlah maksimum untuk nama (English) adalah 255 karakter'),
})

const createFasilitasSchema = fasilitasSchema
const updateFasilitasSchema = fasilitasSchema.partial().extend({ id: idschema })

export type CreateFasilitasInput = z.infer<typeof createFasilitasSchema>
export type UpdateFasilitasInput = z.infer<typeof updateFasilitasSchema>

export async function getFasilitasById(id: string) {
  'use cache'
  cacheTag('fasilitasById', id)
  cacheLife('hours')

  const fasilitasService = new FasilitasService(db)
  return fasilitasService.getFasilitasById(id)
}

export async function getFasilitas(criteria: FasilitasCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheTag('fasilitas')
  cacheLife('hours')

  const fasilitasService = new FasilitasService(db)
  return fasilitasService.getFasilitas(criteria, pageable)
}

export async function createFasilitas(
  input: CreateFasilitasInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(createFasilitasSchema, input)

    const base64utils = new Base64Utils()
    const image = await base64utils.parseBase64(parsed.image, { filename: 'fasilitas' })

    const service = new FasilitasService(db)
    await service.createFasilitas({
      image,
      name: parsed.name,
      enName: parsed.enName,
    })

    updateTag('fasilitas')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateFasilitas(
  input: UpdateFasilitasInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsed = validateInput(updateFasilitasSchema, input)

    let image: File | undefined
    if (parsed.image) {
      const base64utils = new Base64Utils()
      image = await base64utils.parseBase64(parsed.image, { filename: 'fasilitas' })
    }

    const service = new FasilitasService(db)
    await service.updateFasilitas(parsed.id, {
      image,
      name: parsed.name,
      enName: parsed.enName,
    })

    updateTag('fasilitas')
    updateTag('fasilitasById')
    updateTag(parsed.id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteFasilitas(id: string): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])

    const parsedId = validateInput(idschema, id)

    const service = new FasilitasService(db)
    await service.deleteFasilitas(parsedId)

    updateTag('fasilitas')
    updateTag('fasilitasById')
    updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
