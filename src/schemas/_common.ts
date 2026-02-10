import { Post } from '@/schemas/Post'

export type RichText = string

export type HashedString = string

export enum PostScope {
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
}

// MakeOptional: remove the given keys from T and re-add them as optional (preserving their original types).
// K must be a subset of T's keys. This makes only those fields optional (unlike Partial<T> which makes all fields optional).
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type OptionalId<T extends Record<string, any>> = MakeOptional<T, 'id'>

export type OptionalCreatedUpdatedAt<T extends Record<string, any>> = MakeOptional<T, 'createdAt' | 'updatedAt'>