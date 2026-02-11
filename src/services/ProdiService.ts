import { ProdiCriteria, ProdiRepository } from '@/repository/ProdiRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { NewProdi, Prodi, UpdateProdi } from '@/schemas/ProdiTable'
import type { Database } from '@/lib/db'
import type { IOAdapter } from '@/lib/io'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface IProdiService {
  getProdi(criteria: ProdiCriteria, pageable?: PaginationRequest): Promise<PaginatedResult<Prodi>>
  getProdiById(id: string): Promise<Prodi | null>
  getProdiBySlug(slug: string): Promise<Prodi | null>
  createProdi(data: NewProdi): Promise<boolean>
  updateProdi(id: string, data: UpdateProdi): Promise<boolean>
  deleteProdi(id: string): Promise<boolean>
}

export class ProdiNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'PRODI_NOT_FOUND', 404)
    this.name = 'ProdiNotFoundError'
  }
}

export class ProdiService implements IProdiService {
  private repository: ProdiRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new ProdiRepository(db, io)
  }

  async getProdi(
    criteria: ProdiCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Prodi>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getProdiById(id: string): Promise<Prodi> {
    const prodi = await this.repository.getById(id)
    if (!prodi) {
      throw new ProdiNotFoundError(`Prodi with id ${id} not found`)
    }
    return prodi
  }

  async getProdiBySlug(slug: string): Promise<Prodi> {
    const prodi = await this.repository.getBySlug(slug)
    if (!prodi) {
      throw new ProdiNotFoundError(`Prodi with slug ${slug} not found`)
    }
    return prodi
  }

  async createProdi(data: NewProdi): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async updateProdi(id: string, data: UpdateProdi): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }

  async deleteProdi(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }
}

