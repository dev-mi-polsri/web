import { TenagaAjarCriteria, TenagaAjarRepository } from '@/repository/TenagaAjarRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { NewTenagaAjar, TenagaAjar, UpdateTenagaAjar } from '@/schemas/TenagaAjarTable'
import type { Database } from '@/lib/db'
import type { IOAdapter } from '@/lib/io'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface ITenagaAjarService {
  getTenagaAjar(
    criteria: TenagaAjarCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<TenagaAjar>>
  getTenagaAjarById(id: string): Promise<TenagaAjar | null>
  createTenagaAjar(data: NewTenagaAjar): Promise<boolean>
  updateTenagaAjar(id: string, data: UpdateTenagaAjar): Promise<boolean>
  deleteTenagaAjar(id: string): Promise<boolean>
}

export class TenagaAjarNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'TENAGA_AJAR_NOT_FOUND', 404)
    this.name = 'TenagaAjarNotFoundError'
  }
}

export class TenagaAjarService implements ITenagaAjarService {
  private repository: TenagaAjarRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new TenagaAjarRepository(db, io)
  }

  async getTenagaAjar(
    criteria: TenagaAjarCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<TenagaAjar>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getTenagaAjarById(id: string): Promise<TenagaAjar> {
    const tenagaAjar = await this.repository.getById(id)
    if (!tenagaAjar) {
      throw new TenagaAjarNotFoundError(`TenagaAjar with id ${id} not found`)
    }
    return tenagaAjar
  }

  async createTenagaAjar(data: NewTenagaAjar): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async updateTenagaAjar(id: string, data: UpdateTenagaAjar): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }

  async deleteTenagaAjar(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }
}

