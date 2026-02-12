import { DeleteResult, InsertResult, UpdateResult } from 'kysely'

export interface PaginatedResult<T> {
  results: T[]
  page: number
  size: number
  total: number
  hasPrevPage: boolean
  hasNextPage: boolean
  totalPages: number
}

export interface PaginationRequest {
  page: number
  size: number
}

export type Id = string

export interface BaseCriteria {
  searchKeyword?: string
}

export interface IRepository<T, NewT, UpdateT, CriteriaT = BaseCriteria, IdT = Id> {
  getAll(criteria: CriteriaT, pageable: PaginationRequest): Promise<PaginatedResult<T>>
  getById(id: IdT): Promise<T | undefined>
  create(data: NewT): Promise<InsertResult>
  update(id: IdT, data: UpdateT): Promise<UpdateResult>
  delete(id: IdT): Promise<DeleteResult>
}
