import { StandardErrorResponse } from '@/app/api/_common'
import { CreateFasilitasInput, UpdateFasilitasInput } from '@/server-actions/fasilitas'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateFasilitas = () => {
  return useMutation({
    mutationKey: ['create-fasilitas'],
    mutationFn: async (data: CreateFasilitasInput) => {
      const response = await fetch('/api/fasilitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create fasilitas',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Fasilitas berhasil dibuat')
    },
  })
}

export const useUpdateFasilitas = (id: string) => {
  return useMutation({
    mutationKey: ['update-fasilitas', id],
    mutationFn: async (data: Omit<UpdateFasilitasInput, 'id'>) => {
      const response = await fetch(`/api/fasilitas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update fasilitas',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Fasilitas berhasil diperbarui')
    },
  })
}

export const useDeleteFasilitas = (id: string) => {
  return useMutation({
    mutationKey: ['delete-fasilitas', id],
    mutationFn: async () => {
      const response = await fetch(`/api/fasilitas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete fasilitas',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Fasilitas berhasil dihapus')
    },
  })
}
