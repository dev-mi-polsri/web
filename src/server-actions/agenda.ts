'use server'
import { AgendaCriteria } from '@/repository/AgendaRepository'
import { PaginationRequest } from '@/repository/_contracts'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { AgendaService } from '@/services/AgendaService'
import db from '@/lib/db'
import { z } from 'zod'
import {
  dateschema,
  handleServerActionError,
  idschema,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'

const agendaSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul setidaknya terdiri dari 1 karakter')
    .max(255, 'Judul tidak boleh lebih dari 255 karakter'),
  enTitle: z
    .string()
    .min(1, 'Judul (Inggris) setidaknya terdiri dari 1 karakter')
    .max(255, 'Judul (Inggris) tidak boleh lebih dari 255 karakter'),
  description: z.string().min(1, 'Deskripsi setidaknya terdiri dari 1 karakter'),
  startDate: dateschema,
  endDate: dateschema,
  location: z
    .string()
    .min(5, 'Lokasi setidaknya terdiri dari 5 karakter')
    .max(255, 'Lokasi tidak boleh lebih dari 255 karakter'),
})

const createAgendaSchema = agendaSchema
const updateAgendaSchema = agendaSchema
  .partial()
  .extend({ id: z.string().min(36, 'ID tidak valid') })

export type CreateAgendaInput = z.infer<typeof createAgendaSchema>
export type UpdateAgendaInput = z.infer<typeof updateAgendaSchema>

export async function getAgenda(criteria: AgendaCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheTag('agenda')
  cacheLife('hours')

  const agendaService = new AgendaService(db)
  return agendaService.getAgenda(criteria, pageable)
}

export async function getAgendaById(id: string) {
  'use cache'
  cacheTag('agendaById', id)
  cacheLife('hours')

  const parsedId = validateInput(idschema, id)

  const agendaService = new AgendaService(db)
  return agendaService.getAgendaById(parsedId)
}

export async function createAgenda(input: CreateAgendaInput): Promise<ServerActionResponse<void>> {
  try {
    const parsedInput = validateInput(createAgendaSchema, input)

    const agendaService = new AgendaService(db)
    await agendaService.createAgenda(parsedInput)
    updateTag('agenda')
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateAgenda(input: UpdateAgendaInput): Promise<ServerActionResponse<void>> {
  try {
    const parsedInput = validateInput(updateAgendaSchema, input)
    const { id, ...payload } = parsedInput
    const agendaService = new AgendaService(db)

    await agendaService.updateAgenda(id, payload)
    updateTag('agenda')
    updateTag('agendaById')
    updateTag(id)
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteAgenda(id: string): Promise<ServerActionResponse<void>> {
  try {
    const parsedId = validateInput(idschema, id)
    const agendaService = new AgendaService(db)

    await agendaService.deleteAgenda(parsedId)

    updateTag('agenda')
    updateTag('agendaById')
    updateTag(parsedId)
  } catch (error) {
    return handleServerActionError(error)
  }
}
