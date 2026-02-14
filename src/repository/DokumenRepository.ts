import { MediaType, MediaTypeFactory } from '@/schemas/MediaTable'
import { PaginatedResult, PaginationRequest, processPagination } from '@/repository/_common'
import { Dokumen, NewDokumen, UpdateDokumen } from '@/schemas/DokumenTable'
import { DeleteResult, InsertResult, Kysely } from 'kysely'
import { Database } from '@/lib/db'
import { IOAdapter, NodeIOAdapter } from '@/lib/io'

export type DokumenCriteria = {
  searchKeyword?: string
  jenisDokumen?: MediaType
}

interface IDokumenRepository {
  getAll(criteria: DokumenCriteria, pageable: PaginationRequest): Promise<PaginatedResult<Dokumen>>
  getById(id: string): Promise<Dokumen | undefined>
  create(dokumen: NewDokumen): Promise<InsertResult>
  update(id: string, dokumen: UpdateDokumen): Promise<boolean>
  delete(id: string): Promise<DeleteResult>
}

export class DokumenRepository implements IDokumenRepository {
  private db: Kysely<Database>
  private io: IOAdapter

  constructor(database: Kysely<Database>, io?: IOAdapter) {
    this.db = database
    this.io = io ?? new NodeIOAdapter()
  }

  async getAll(
    criteria: DokumenCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<Dokumen>> {
    let baseQuery = this.db.selectFrom('dokumen').innerJoin('media', 'media.url', 'dokumen.url')

    if (criteria.searchKeyword) {
      baseQuery = baseQuery.where(
        (eb) => eb.fn('lower', [eb.fn('concat', ['dokumen.name', eb.val(' '), 'dokumen.url'])]),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }

    if (criteria.jenisDokumen) {
      baseQuery = baseQuery.where('media.type', '=', criteria.jenisDokumen)
    }

    const results = await baseQuery
      // select only dokumen columns so the return type stays Dokumen
      .selectAll('dokumen')
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '[Debug] Executing Query :',
        baseQuery
          .selectAll('dokumen')
          .offset((pageable.page - 1) * pageable.size)
          .limit(pageable.size)
          .compile().sql,
      )
    }

    const totalRow = await this.db
      .selectFrom('dokumen')
      .innerJoin('media', 'media.url', 'dokumen.url')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', [eb.fn('concat', ['dokumen.name', eb.val(' '), 'dokumen.url'])]),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.jenisDokumen, (qb) => qb.where('media.type', '=', criteria.jenisDokumen!))
      .select(({ fn }) => fn.count<number>('dokumen.id').as('total'))
      .executeTakeFirstOrThrow()

    return processPagination({
      results,
      total: totalRow!.total,
      page: pageable.page,
      size: pageable.size,
    })
  }

  async getById(id: string): Promise<Dokumen | undefined> {
    return await this.db
      .selectFrom('dokumen')
      .where('dokumen.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async create(dokumen: NewDokumen): Promise<InsertResult> {
    const uploadedFilePath = await this.io.write(dokumen.file)
    const { file, ...data } = dokumen

    return await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaTypeFactory.fromMimeType(dokumen.file.type),
          mime: dokumen.file.type,
          isDownloadable: false,
        })
        .executeTakeFirst()

      return await trx
        .insertInto('dokumen')
        .values({
          ...data,
          url: uploadedFilePath,
        })
        .executeTakeFirst()
    })
  }

  async update(id: string, dokumen: UpdateDokumen): Promise<boolean> {
    const existingDokumen = await this.getById(id)
    if (!existingDokumen) {
      return false
    }

    const { file, ...data } = dokumen

    if (!file) {
      await this.db.updateTable('dokumen').set(data).where('dokumen.id', '=', id).executeTakeFirst()
      return true
    }

    const uploadedFilePath = await this.io.write(file)

    await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('media')
        .values({
          url: uploadedFilePath,
          type: MediaTypeFactory.fromMimeType(file.type),
          mime: file.type,
          isDownloadable: false,
        })
        .executeTakeFirst()

      await trx
        .updateTable('dokumen')
        .set({
          ...data,
          url: uploadedFilePath,
        })
        .where('dokumen.id', '=', id)
        .executeTakeFirst()
    })

    return true
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('dokumen').where('dokumen.id', '=', id).executeTakeFirst()
  }
}
