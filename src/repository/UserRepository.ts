import { PaginatedResult, PaginationRequest, processPagination } from '@/repository/_common'
import { Database } from '@/lib/db'
import { NewUser, UpdateUser, User, UserRole } from '@/schemas/User'
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely'

export type UserCriteria = {
  searchKeyword?: string
  email?: string
  role?: UserRole
}

export interface IUserRepository {
  getAll(criteria: UserCriteria, pageable: PaginationRequest): Promise<PaginatedResult<User>>
  getById(id: string): Promise<User | undefined>
  getByEmail(email: string): Promise<User | undefined>
  create(data: NewUser): Promise<InsertResult>
  update(id: string, data: UpdateUser): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}

export class UserRepository implements IUserRepository {
  private db: Kysely<Database>

  constructor(database: Kysely<Database>) {
    this.db = database
  }

  async getAll(
    criteria: UserCriteria,
    pageable: PaginationRequest,
  ): Promise<PaginatedResult<User>> {
    let baseQuery = this.db.selectFrom('user')

    if (criteria.searchKeyword) {
      baseQuery = baseQuery.where(
        (eb) => eb.fn('lower', [eb.fn('concat', ['user.name', eb.val(' '), 'user.email'])]),
        'like',
        `%${criteria.searchKeyword.toLowerCase()}%`,
      )
    }

    if (criteria.email) baseQuery = baseQuery.where('user.email', '=', criteria.email)
    if (criteria.role) baseQuery = baseQuery.where('user.role', '=', criteria.role)

    const results = await baseQuery
      .selectAll()
      .offset((pageable.page - 1) * pageable.size)
      .limit(pageable.size)
      .execute()

    const totalRow = await this.db
      .selectFrom('user')
      .$if(!!criteria.searchKeyword, (qb) =>
        qb.where(
          (eb) => eb.fn('lower', [eb.fn('concat', ['user.name', eb.val(' '), 'user.email'])]),
          'like',
          `%${criteria.searchKeyword!.toLowerCase()}%`,
        ),
      )
      .$if(!!criteria.email, (qb) => qb.where('user.email', '=', criteria.email!))
      .$if(!!criteria.role, (qb) => qb.where('user.role', '=', criteria.role!))
      .select(({ fn }) => fn.count<number>('user.id').as('total'))
      .executeTakeFirstOrThrow()

    return processPagination({
      results,
      total: totalRow.total,
      ...pageable,
    })
  }

  async getById(id: string): Promise<User | undefined> {
    return await this.db.selectFrom('user').where('user.id', '=', id).selectAll().executeTakeFirst()
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.db
      .selectFrom('user')
      .where('user.email', '=', email)
      .selectAll()
      .executeTakeFirst()
  }

  async create(data: NewUser): Promise<InsertResult> {
    return await this.db.insertInto('user').values(data).executeTakeFirst()
  }

  async update(id: string, data: UpdateUser): Promise<UpdateResult> {
    return await this.db.updateTable('user').set(data).where('user.id', '=', id).executeTakeFirst()
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.db.deleteFrom('user').where('user.id', '=', id).executeTakeFirst()
  }
}
