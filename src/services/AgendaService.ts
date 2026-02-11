import { AgendaCriteria, AgendaRepository } from '@/repository/AgendaRepository'
import { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { Agenda, NewAgenda, UpdateAgenda } from '@/schemas/AgendaTable'
import { Kysely } from 'kysely'
import { Database } from '@/lib/db'
import { normalizePagination, ServiceError } from './_common'

export interface IAgendaService {
  getAgenda(criteria: AgendaCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Agenda>>
  getAgendaById(id: string): Promise<Agenda | null>
  createAgenda(data: NewAgenda): Promise<boolean>
  updateAgenda(id: string, data: UpdateAgenda): Promise<boolean | null>
  deleteAgenda(id: string): Promise<boolean>
}

export class AgendaNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'AGENDA_NOT_FOUND', 404)
    this.name = 'AgendaNotFoundError'
  }
}

export class AgendaService implements IAgendaService {
  private db: Kysely<Database>
  private repository: AgendaRepository

  constructor(db: Kysely<Database>) {
    this.db = db
    this.repository = new AgendaRepository(this.db)
  }

  async createAgenda(data: NewAgenda): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async deleteAgenda(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }

  async getAgenda(
    criteria: AgendaCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Agenda>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getAgendaById(id: string): Promise<Agenda> {
    const agenda = await this.repository.getById(id)
    if (!agenda) {
      throw new AgendaNotFoundError(`Agenda with id ${id} not found`)
    }
    return agenda
  }

  async updateAgenda(id: string, data: UpdateAgenda): Promise<boolean | null> {
    await this.repository.update(id, data)
    return true
  }
}
