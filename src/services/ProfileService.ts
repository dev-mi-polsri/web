import { ProfileCriteria, ProfileRepository } from '@/repository/ProfileRepository'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { NewProfile, Profile, UpdateProfile } from '@/schemas/ProfileTable'
import type { Database } from '@/lib/db'
import type { IOAdapter } from '@/lib/io'
import type { Kysely } from 'kysely'
import { normalizePagination, ServiceError } from './_common'

export interface IProfileService {
  getProfile(
    criteria: ProfileCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Profile>>
  getProfileById(id: string): Promise<Profile | null>
  getProfileBySlug(slug: string): Promise<Profile | null>
  createProfile(data: NewProfile): Promise<boolean>
  updateProfile(id: string, data: UpdateProfile): Promise<boolean>
  deleteProfile(id: string): Promise<boolean>
}

export class ProfileNotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'PROFILE_NOT_FOUND', 404)
    this.name = 'ProfileNotFoundError'
  }
}

export class ProfileService implements IProfileService {
  private repository: ProfileRepository

  constructor(db: Kysely<Database>, io?: IOAdapter) {
    this.repository = new ProfileRepository(db, io)
  }

  async getProfile(
    criteria: ProfileCriteria,
    pageable?: PaginationRequest,
  ): Promise<PaginatedResult<Profile>> {
    return await this.repository.getAll(criteria, normalizePagination(pageable))
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.repository.getById(id)
    if (!profile) {
      throw new ProfileNotFoundError(`Profile with id ${id} not found`)
    }
    return profile
  }

  async getProfileBySlug(slug: string): Promise<Profile> {
    const profile = await this.repository.getBySlug(slug)
    if (!profile) {
      throw new ProfileNotFoundError(`Profile with slug ${slug} not found`)
    }
    return profile
  }

  async createProfile(data: NewProfile): Promise<boolean> {
    await this.repository.create(data)
    return true
  }

  async updateProfile(id: string, data: UpdateProfile): Promise<boolean> {
    await this.repository.update(id, data)
    return true
  }

  async deleteProfile(id: string): Promise<boolean> {
    await this.repository.delete(id)
    return true
  }
}

