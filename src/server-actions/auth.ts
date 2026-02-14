'use server'
import { z } from 'zod'
import { APP_ROLES, auth } from '@/lib/auth'
import {
  handleServerActionError,
  ServerActionError,
  ServerActionResponse,
  validateInput,
} from '@/server-actions/_common'
import { UserWithRole } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { getSessionThrowable } from './_resource-access'

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

export type CreateUserInput = z.infer<typeof userSchema>
export type UpdatePasswordAdminInput = z.infer<typeof updatePasswordAdminSchema>
export type UpdatePasswordUserInput = z.infer<typeof updatePasswordUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

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
