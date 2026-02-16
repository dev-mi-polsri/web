import { Dokumen, NewDokumen, UpdateDokumen } from '@/schemas/DokumenTable'
import { DokumenCriteria, DokumenRepository } from '@/repository/DokumenRepository'
import { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { normalizePagination, ServiceError } from '@/services/_common'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'
import { Kysely } from 'kysely'
import { Database } from '@/lib/db'

export interface IDokumenService {
  getDokumen(
    criteria: DokumenCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Dokumen>>
  getDokumenById(id: string): Promise<Dokumen>
  createDokumen(data: NewDokumen): Promise<boolean>
  updateDokumen(id: string, data: UpdateDokumen): Promise<boolean>
  deleteDokumen(id: string): Promise<boolean>
}

export class DokumenNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'DOKUMEN_NOT_FOUND', 404)
    this.name = 'DokumenNotFoundError'
  }
}

export class DokumenService implements IDokumenService {
  private repository: DokumenRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new DokumenRepository(db, io)
  }

  async createDokumen(data: NewDokumen): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async deleteDokumen(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }

  async getDokumen(
    criteria: DokumenCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Dokumen>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getDokumenById(id: string): Promise<Dokumen> {
    const dokumen = await this.repository.getById(id)
    if (!dokumen) {
      throw new DokumenNotFoundError(`Dokumen with id ${id} not found`)
    }
    return dokumen
  }

  async updateDokumen(id: string, data: UpdateDokumen): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }
}
