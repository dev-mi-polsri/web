import { UserCriteria, UserRepository } from '@/repository/UserRepository'
import {
  processPagination,
  type PaginatedResult,
  type PaginationRequest,
} from '@/repository/_contracts'
import { MaskedUser, NewUser, RegisterUser, UpdateUser, UserRole } from '@/schemas/User'
import type { Database } from '@/lib/db'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from '@/services/_common'
import { generatePasswordHash, verifyPassword } from '@/lib/auth-utils'

export interface IUserService {
  getUser(
    criteria: UserCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<MaskedUser>>
  getUserById(id: string): Promise<MaskedUser>
  getUserByEmail(email: string): Promise<MaskedUser>
  validateCredentials(email: string, password: string): Promise<boolean>
  createUser(data: RegisterUser): Promise<boolean>
  updateUser(id: string, data: Omit<UpdateUser, 'password' | 'passwordSalt'>): Promise<boolean>
  updateUserPassword(id: string, password: string): Promise<boolean>
  deleteUser(id: string): Promise<boolean>
}

export class EmailAlreadyExistsError extends ServiceError {
  constructor(message: string) {
    super(message, 'EMAIL_ALREADY_EXISTS', 400)
    this.name = 'EmailAlreadyExistsError'
  }
}
export class InvalidCredentialsError extends ServiceError {
  constructor(message: string) {
    super(message, 'INVALID_CREDENTIALS', 401)
    this.name = 'InvalidCredentialsError'
  }
}

export class UserNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'USER_NOT_FOUND', 404)
    this.name = 'UserNotFoundError'
  }
}

export class UserService implements IUserService {
  private repository: UserRepository

  constructor(db: Kysely<Database>) {
    this.repository = new UserRepository(db)
  }

  async getUser(
    criteria: UserCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<MaskedUser>> {
    const user = await this.repository.getAll(criteria, normalizePagination(pageable))
    // return {
    //   page: user.page,
    //   size: user.size,
    //   total: user.total,
    //   results: user.results.map((u) => {
    //     const { password, passwordSalt, ...maskedUser } = u
    //     return maskedUser
    //   }),
    // }
    return processPagination({
      ...user,
    })
  }

  async getUserById(id: string): Promise<MaskedUser> {
    const user = await this.repository.getById(id)
    if (!user) {
      throw new UserNotFoundError(`User with id ${id} not found`)
    }
    const { password, passwordSalt, ...maskedUser } = user
    return maskedUser
  }

  async getUserByEmail(email: string): Promise<MaskedUser> {
    const user = await this.repository.getByEmail(email)
    if (!user) {
      throw new UserNotFoundError(`User with email ${email} not found`)
    }
    const { password, passwordSalt, ...maskedUser } = user
    return maskedUser
  }

  async createUser(data: RegisterUser): Promise<boolean> {
    const userExists = await this.getUserByEmail(data.email)
    if (userExists) {
      throw new EmailAlreadyExistsError('User with this email already exists')
    }

    const { salt, hash } = await generatePasswordHash(data.password)

    const user = {
      role: data.role ?? UserRole.ADMIN,
      name: data.name,
      email: data.email,
      passwordSalt: salt,
      password: hash,
    } satisfies NewUser

    await this.repository.create(user)
    return true
  }

  async updateUser(
    id: string,
    data: Omit<UpdateUser, 'password' | 'passwordSalt'>,
  ): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const user = await this.repository.getByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    const isValid = await verifyPassword(password, user.passwordSalt, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    return true
  }

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const { salt, hash } = await generatePasswordHash(password)
    await this.repository.update(id, { password: hash, passwordSalt: salt })
    return true
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }
}
