'use server'
import { z } from 'zod'
import { APP_ROLES, auth } from '@/lib/auth'
import {
  handleServerActionError,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { UserWithRole } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { getSessionThrowable } from './_resource-access'
import { PaginatedResult, PaginationRequest, processPagination } from '@/repository/_contracts'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(APP_ROLES),
})

const updatePasswordAdminSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8),
})

const updatePasswordUserSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
})

const updateUserSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).optional(),
})

const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(APP_ROLES),
})

const updateMyDetailsSchema = z.object({
  name: z.string().min(1),
})

export type CreateUserInput = z.infer<typeof userSchema>
export type UpdatePasswordAdminInput = z.infer<typeof updatePasswordAdminSchema>
export type UpdatePasswordUserInput = z.infer<typeof updatePasswordUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type UpdateMyDetailsInput = z.infer<typeof updateMyDetailsSchema>

export async function getUsers(
  pageable: PaginationRequest,
): Promise<ServerActionResponse<PaginatedResult<UserWithRole>>> {
  try {
    await getSessionThrowable(['admin'])
    const users = await auth.api.listUsers({
      query: {
        limit: pageable.size,
        offset: (pageable.page - 1) * pageable.size,
      },
      headers: await headers(),
    })
    return processPagination({
      results: users.users,
      total: users.total,
      page: pageable.page,
      size: pageable.size,
    })
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function getUserById(id: string): Promise<ServerActionResponse<UserWithRole>> {
  try {
    await getSessionThrowable(['admin'])
    return await auth.api.getUser({ query: { id: id }, headers: await headers() })
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function createUser(
  input: CreateUserInput,
): Promise<ServerActionResponse<{ user: UserWithRole }>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedInput = validateInput(userSchema, input)

    return await auth.api.createUser({
      body: {
        ...parsedInput,
      },
      headers: await headers(),
    })
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateUser(input: UpdateUserInput): Promise<ServerActionResponse<boolean>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedInput = validateInput(updateUserSchema, input)

    await auth.api.adminUpdateUser({
      body: {
        userId: parsedInput.userId,
        data: {
          name: parsedInput.name,
        },
      },
      headers: await headers(),
    })

    return true
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updatePasswordAdmin(
  input: UpdatePasswordAdminInput,
): Promise<ServerActionResponse<boolean>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedInput = validateInput(updatePasswordAdminSchema, input)

    await auth.api.setUserPassword({
      body: {
        userId: parsedInput.userId,
        newPassword: parsedInput.newPassword,
      },
      headers: await headers(),
    })

    return true
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updatePasswordUser(
  input: UpdatePasswordUserInput,
): Promise<ServerActionResponse<boolean>> {
  try {
    await getSessionThrowable()
    const parsedInput = validateInput(updatePasswordUserSchema, input)

    await auth.api.changePassword({
      body: {
        newPassword: parsedInput.newPassword,
        currentPassword: parsedInput.currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    })
    return true
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateUserRole(
  input: UpdateUserRoleInput,
): Promise<ServerActionResponse<boolean>> {
  try {
    await getSessionThrowable(['admin'])
    const parsedInput = validateInput(updateUserRoleSchema, input)

    await auth.api.setRole({
      body: {
        userId: parsedInput.userId,
        role: parsedInput.role,
      },
      headers: await headers(),
    })

    return true
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function updateMyDetails(
  input: UpdateMyDetailsInput,
): Promise<ServerActionResponse<boolean>> {
  try {
    await getSessionThrowable()
    const parsedInput = validateInput(updateMyDetailsSchema, input)

    await auth.api.updateUser({
      body: {
        name: parsedInput.name,
      },
      headers: await headers(),
    })

    return true
  } catch (error) {
    return handleServerActionError(error)
  }
}
