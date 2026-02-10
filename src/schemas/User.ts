import { HashedString } from '@/schemas/_common'

export enum UserRole {
  ADMIN = 'admin',
  WRITER = 'writer',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  password: HashedString

  createdAt: Date
  updatedAt: Date
}

export interface Admin extends User {
  role: UserRole.ADMIN
}

export interface Writer extends User {
  role: UserRole.WRITER
}
