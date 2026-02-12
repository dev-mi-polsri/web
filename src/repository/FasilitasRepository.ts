import { PaginatedResult, PaginationRequest } from '@/repository/_common'
import { Fasilitas, NewFasilitas, UpdateFasilitas } from '@/schemas/FasilitasTable'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'
import { Database } from '@/lib/db'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'
import { MediaType } from '@/schemas/MediaTable'

export interface FasilitasCriteria {
  searchKeyword?: string
}

interface IFasilitasRepository {
  getAll(
    criteria: FasilitasCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Fasilitas>>
  getById(id: string): Promise<Fasilitas | undefined>
  create(fasilitas: NewFasilitas): Promise<InsertResult>
  update(id: string, fasilitas: UpdateFasilitas): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class FasilitasRepository implements IFasilitasRepository {
  private db: Kysely<Database>
  private io: IOAdapter

  constructor(database: Kysely<Database>, io: IOAdapter) {
    this.db = database
    this.io = io ?? new NodeIOAdapter()
  }

  async create(fasilitas: NewFasilitas): Promise<InsertResult> {
    const uploadedFilePath = await this.io.write(fasilitas.image)
    const { image: _image, ...rest } = fasilitas

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaType.IMAGE,
          mime: fasilitas.image.type,
          isDownloadable: false,
        })
        .executeTakeFirst()

      return await trx
        .insertInto('fasilitas')
        .values({
          ...rest,
          image: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('fasilitas').where('fasilitas.id', '=', id).executeTakeFirst()
  }

  async getAll(
    criteria: FasilitasCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Fasilitas>> {
    let query = this.db.selectFrom('fasilitas')

    if (criteria.searchKeyword) {
      query = query.where(
        (eb) =>
          eb.fn('lower', [eb.fn('concat', ['fasilitas.name', eb.val(' '), 'fasilitas.enName'])]),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }

    const results = await query
      .selectAll()
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('fasilitas')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) =>
            eb.fn('lower', [eb.fn('concat', ['fasilitas.name', eb.val(' '), 'fasilitas.enName'])]),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .select(({ fn }) => fn.count<number>('fasilitas.id').as('total'))
      .executeTakeFirstOrThrow()

    return {
      ...totalRow,
      ...pageable,
      results,
    }
  }

  async getById(id: string): Promise<Fasilitas | undefined> {
    return await this.db
      .selectFrom('fasilitas')
      .where('fasilitas.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async update(id: string, fasilitas: UpdateFasilitas): Promise<UpdateResult> {
    if (!fasilitas.image) {
      const { image: _image, ...rest } = fasilitas
      return await this.db
        .updateTable('fasilitas')
        .set(rest)
        .where('fasilitas.id', '=', id)
        .executeTakeFirst()
    }

    const uploadedFilePath = await this.io.write(fasilitas.image)
    const { image: _image, ...rest } = fasilitas

    return await this.db.transaction().execute(async (trx) => {
      let media
      if (fasilitas.image) {
        media = await trx
          .insertInto('media')
          .values({
            url: uploadedFilePath,
            type: MediaType.IMAGE,
            mime: fasilitas.image.type,
            isDownloadable: false,
          })
          .executeTakeFirst()
      }

      return await trx
        .updateTable('fasilitas')
        .set({
          ...rest,
          image: media ? uploadedFilePath : undefined,
        })
        .where('fasilitas.id', '=', id)
        .executeTakeFirst()
    })
  }
}
