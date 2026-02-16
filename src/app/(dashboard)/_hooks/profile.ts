import { StandardErrorResponse } from '@/app/api/_common'
import { CreateProfileInput, UpdateProfileInput } from '@/server-actions/profile'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateProfile = () => {
  return useMutation({
    mutationKey: ['create-profile'],
    mutationFn: async (data: CreateProfileInput) => {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create profile',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Profile berhasil dibuat')
    },
  })
}

export const useUpdateProfile = (id: string) => {
  return useMutation({
    mutationKey: ['update-profile', id],
    mutationFn: async (data: Omit<UpdateProfileInput, 'id'>) => {
      const response = await fetch(`/api/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update profile',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Profile berhasil diperbarui')
    },
  })
}

export const useDeleteProfile = (id: string) => {
  return useMutation({
    mutationKey: ['delete-profile', id],
    mutationFn: async () => {
      const response = await fetch(`/api/profile/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete profile',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Profile berhasil dihapus')
    },
  })
}
