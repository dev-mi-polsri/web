import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Database } from '@/lib/db'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'
import {
  Homebase,
  JenisTenagaAjar,
  NewTenagaAjar,
  TenagaAjar,
  UpdateTenagaAjar,
} from '@/schemas/TenagaAjarTable'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type TenagaAjarCriteria = {
  searchKeyword?: string
  jenis?: JenisTenagaAjar
  homebase?: Homebase
  isPejabat?: boolean
}

export interface ITenagaAjarRepository {
  getAll(
    criteria: TenagaAjarCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<TenagaAjar>>
  getById(id: string): Promise<TenagaAjar | undefined>
  create(data: NewTenagaAjar): Promise<InsertResult>
  update(id: string, data: UpdateTenagaAjar): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class TenagaAjarRepository implements ITenagaAjarRepository {
  private db: Kysely<Database>
  private io: IOAdapter

  constructor(database: Kysely<Database>, io?: IOAdapter) {
    this.db = database
    this.io = io ?? new NodeIOAdapter()
  }

  async getAll(
    criteria: TenagaAjarCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<TenagaAjar>> {
    let query = this.db.selectFrom('tenagaAjar')

    if (criteria.searchKeyword) {
      query = query.where(
        (eb) =>
          eb.fn('lower', [eb.fn('concat', ['tenagaAjar.nama', eb.val(' '), 'tenagaAjar.nip'])]),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }
    if (criteria.jenis) query = query.where('tenagaAjar.jenis', '=', criteria.jenis)
    if (criteria.homebase) query = query.where('tenagaAjar.homebase', '=', criteria.homebase)
    if (typeof criteria.isPejabat === 'boolean')
      query = query.where('tenagaAjar.isPejabat', '=', criteria.isPejabat)

    const results = await query
      .selectAll()
      .orderBy('tenagaAjar.isPejabat', 'desc')
      .orderBy('tenagaAjar.nama', 'asc')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('tenagaAjar')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) =>
            eb.fn('lower', [eb.fn('concat', ['tenagaAjar.nama', eb.val(' '), 'tenagaAjar.nip'])]),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.jenis, (qb) => qb.where('tenagaAjar.jenis', '=', criteria.jenis!))
      .$if(!!criteria.homebase, (qb) => qb.where('tenagaAjar.homebase', '=', criteria.homebase!))
      .$if(typeof criteria.isPejabat === 'boolean', (qb) =>
        qb.where('tenagaAjar.isPejabat', '=', criteria.isPejabat!),
      )
      .select(({ fn }) => fn.count<number>('tenagaAjar.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...totalRow,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<TenagaAjar | undefined> {
    return await this.db
      .selectFrom('tenagaAjar')
      .where('tenagaAjar.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewTenagaAjar): Promise<InsertResult> {
    const uploadedFilePath = await this.io.write(data.foto)
    const { foto: _foto, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: data.foto.type,
        })
        .executeTakeFirst()

      return await trx
        .insertInto('tenagaAjar')
        .values({
          ...rest,
          foto: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async update(id: string, data: UpdateTenagaAjar): Promise<UpdateResult> {
    if (!data.foto) {
      const { foto: _foto, ...rest } = data
      return await this.db
        .updateTable('tenagaAjar')
        .set(rest)
        .where('tenagaAjar.id', '=', id)
        .executeTakeFirst()
    }

    const uploadedFilePath = await this.io.write(data.foto)
    const { foto: _foto, ...rest } = data

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: data.foto!.type,
        })
        .executeTakeFirst()

      return await trx
        .updateTable('tenagaAjar')
        .set({
          ...rest,
          foto: uploadedFilePath,
        })
        .where('tenagaAjar.id', '=', id)
        .executeTakeFirst()
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('tenagaAjar').where('tenagaAjar.id', '=', id).executeTakeFirst()
  }
}
