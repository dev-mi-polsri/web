import { StandardErrorResponse } from '@/app/api/_common'
import { CreatePostInput, UpdatePostInput } from '@/server-actions/post'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreatePost = () => {
  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: async (data: CreatePostInput) => {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create post',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Post berhasil dibuat')
    },
  })
}

export const useUpdatePost = (id: string) => {
  return useMutation({
    mutationKey: ['update-post', id],
    mutationFn: async (data: Omit<UpdatePostInput, 'id'>) => {
      const response = await fetch(`/api/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update post',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Post berhasil diperbarui')
    },
  })
}

export const useDeletePost = (id: string) => {
  return useMutation({
    mutationKey: ['delete-post', id],
    mutationFn: async () => {
      const response = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete post',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Post berhasil dihapus')
    },
  })
}
