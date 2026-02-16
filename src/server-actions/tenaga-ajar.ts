'use server'

import { z } from 'zod'
import { cacheLife, cacheTag } from 'next/cache'
import db from '@/lib/db'
import { TenagaAjarService } from '@/services/TenagaAjarService'
import type { TenagaAjarCriteria } from '@/repository/TenagaAjarRepository'
import type { PaginationRequest } from '@/repository/_contracts'
import {
  base64schema,
  handleServerActionError,
  idschema,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { Base64Utils } from '@/lib/base64'
import { Homebase, JenisTenagaAjar } from '@/schemas/TenagaAjarTable'
import { getSessionThrowable } from './_resource-access'

const tenagaAjarSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(255),
  jenis: z.enum(JenisTenagaAjar),
  homebase: z.enum(Homebase),
  foto: base64schema,
  nip: z.string().min(1, 'NIP tidak boleh kosong').max(64),
  nidn: z.string().max(64).optional(),
  nuptk: z.string().max(64).optional(),
  isPejabat: z.boolean().optional(),
})

const createTenagaAjarSchema = tenagaAjarSchema
const updateTenagaAjarSchema = tenagaAjarSchema.partial().extend({ id: idschema })

export type CreateTenagaAjarInput = z.infer<typeof createTenagaAjarSchema>
export type UpdateTenagaAjarInput = z.infer<typeof updateTenagaAjarSchema>

export async function getTenagaAjar(criteria: TenagaAjarCriteria, pageable: PaginationRequest) {
  // 'use cache'
  // cacheTag('tenagaAjar')
  // cacheLife('hours')

  const service = new TenagaAjarService(db)
  return service.getTenagaAjar(criteria, pageable)
}

export async function getTenagaAjarById(id: string) {
  // 'use cache'
  // cacheTag('tenagaAjarById', id)
  // cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const service = new TenagaAjarService(db)
  return service.getTenagaAjarById(parsedId)
}

export async function createTenagaAjar(
  input: CreateTenagaAjarInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])
    const parsed = validateInput(createTenagaAjarSchema, input)

    const base64utils = new Base64Utils()
    const foto = await base64utils.parseBase64(parsed.foto, { filename: 'tenaga-ajar' })

    const service = new TenagaAjarService(db)
    await service.createTenagaAjar({
      ...parsed,
      foto,
      isPejabat: parsed.isPejabat ?? false,
    })

    // updateTag('tenagaAjar')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateTenagaAjar(
  input: UpdateTenagaAjarInput,
): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])
    const parsed = validateInput(updateTenagaAjarSchema, input)

    let foto: File | undefined
    if (parsed.foto) {
      const base64utils = new Base64Utils()
      foto = await base64utils.parseBase64(parsed.foto, { filename: 'tenaga-ajar' })
    }

    const service = new TenagaAjarService(db)
    await service.updateTenagaAjar(parsed.id, {
      ...parsed,
      foto,
    })

    // updateTag('tenagaAjar')
    // updateTag('tenagaAjarById')
    // updateTag(parsed.id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteTenagaAjar(id: string): Promise<ServerActionResponse<void>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedId = validateInput(idschema, id)

    const service = new TenagaAjarService(db)
    await service.deleteTenagaAjar(parsedId)

    // updateTag('tenagaAjar')
    // updateTag('tenagaAjarById')
    // updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
