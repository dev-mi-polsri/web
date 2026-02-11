import { HashedString } from '@/schemas/_common'
import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export enum UserRole {
  ADMIN = 'admin',
  WRITER = 'writer',
}

export interface UserTable {
  id: Generated<string>
  name: string
  email: string
  role: UserRole
  password: HashedString

  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UpdateUser = Updateable<NewUser>

export interface Admin extends User {
  role: UserRole.ADMIN
}

export interface Writer extends User {
  role: UserRole.WRITER
}
