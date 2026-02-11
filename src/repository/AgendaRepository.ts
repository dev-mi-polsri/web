import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Agenda, NewAgenda, UpdateAgenda } from '@/schemas/AgendaTable'
import { Database } from '@/lib/db'
import { DeleteResult, InsertResult, Kysely, sql, UpdateResult } from 'kysely'

type AgendaCriteria = {
  searchKeyword?: string
  location?: string
  startDate?: Date
  endDate?: Date
}

interface IAgendaRepository {
  getAll(criteria: AgendaCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Agenda>>
  getById(id: string): Promise<Agenda | undefined>
  create(agenda: NewAgenda): Promise<InsertResult>
  update(id: string, agenda: UpdateAgenda): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class AgendaRepository implements IAgendaRepository {
  private db: Kysely<Database>

  constructor(database: Kysely<Database>) {
    this.db = database
  }

  async getAll(
    criteria: AgendaCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Agenda>> {
    let query = this.db.selectFrom('agenda')

    if (criteria.searchKeyword) {
      // LOWER(CONCAT(agenda.title + ' ' + agenda.enTitle) LIKE LOWER(criteria.searchKeyword)
      query = query.where(
        (eb) => eb.fn('lower', [eb.fn('concat', ['agenda.title', eb.val(' '), 'agenda.enTitle'])]),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }

    if (criteria.startDate && criteria.endDate) {
      // agenda.startDate >= criteria.startDate
      query = query.where('agenda.startDate', '>=', criteria.startDate)

      // agenda.endDate <= criteria.endDate
      query = query.where('agenda.endDate', '<=', criteria.endDate)
    }

    query = query.offset((pageable.page - 1) * pageable.size).limit(pageable.size)

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Debug] Executing Query :', query.selectAll().compile().sql)
    }

    // SELECT *
    const results = await query.selectAll().execute()

    // SELECT COUNT(agenda.id) AS total
    const total = await this.db
      .selectFrom('agenda')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) =>
            eb.fn('lower', [eb.fn('concat', ['agenda.title', eb.val(' '), 'agenda.enTitle'])]),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!(criteria.startDate && criteria.endDate), (qb) =>
        qb
          .where('agenda.startDate', '>=', criteria.startDate!)
          .where('agenda.endDate', '<=', criteria.endDate!),
      )
      .select(({ fn }) => fn.count<number>('agenda.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...total,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<Agenda | undefined> {
    // SELECT * FROM agenda WHERE agenda.id = id
    return await this.db
      .selectFrom('agenda')
      .where('agenda.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async update(id: string, agenda: UpdateAgenda): Promise<UpdateResult> {
    // UPDATE agenda SET ... WHERE agenda.id = id
    return await this.db
      .updateTable('agenda')
      .set(agenda)
      .where('agenda.id', '=', id)
      .executeTakeFirst()
  }

  async create(agenda: NewAgenda): Promise<InsertResult> {
    // INSERT INTO agenda (...) VALUES (...)
    return await this.db.insertInto('agenda').values(agenda).executeTakeFirst()
  }

  async delete(id: string): Promise<DeleteResult> {
    // DELETE FROM agenda WHERE agenda.id = id
    return await this.db.deleteFrom('agenda').where('agenda.id', '=', id).executeTakeFirst()
  }
}
