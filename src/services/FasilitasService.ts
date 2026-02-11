import { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { Fasilitas, NewFasilitas, UpdateFasilitas } from '@/schemas/FasilitasTable'
import { FasilitasCriteria, FasilitasRepository } from '@/repository/FasilitasRepository'
import { Database } from '@/lib/db'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'
import { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface IFasilitasService {
  getFasilitas(
    criteria: FasilitasCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Fasilitas>>
  getFasilitasById(id: string): Promise<Fasilitas | null>
  createFasilitas(data: NewFasilitas): Promise<boolean>
  updateFasilitas(id: string, data: UpdateFasilitas): Promise<boolean>
  deleteFasilitas(id: string): Promise<boolean>
}

export class FasilitasNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'FASILITAS_NOT_FOUND', 404)
    this.name = 'FasilitasNotFoundError'
  }
}

export class FasilitasService implements IFasilitasService {
  private repository: FasilitasRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new FasilitasRepository(db, io ?? new NodeIOAdapter())
  }

  async getFasilitas(
    criteria: FasilitasCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Fasilitas>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getFasilitasById(id: string): Promise<Fasilitas> {
    const fasilitas = await this.repository.getById(id)
    if (!fasilitas) {
      throw new FasilitasNotFoundError(`Fasilitas with id ${id} not found`)
    }
    return fasilitas
  }

  async deleteFasilitas(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return Promise.resolve(true)
  }

  async createFasilitas(data: NewFasilitas): Promise<boolean> {
    await this.repository.create(data)
    return Promise.resolve(true)
  }

  async updateFasilitas(id: string, data: UpdateFasilitas): Promise<boolean> {
    await this.repository.update(id, data)
    return Promise.resolve(true)
  }
}
