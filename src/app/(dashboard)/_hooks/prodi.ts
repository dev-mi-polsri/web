import { StandardErrorResponse } from '@/app/api/_common'
import { CreateProdiInput, UpdateProdiInput } from '@/server-actions/prodi'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateProdi = () => {
  return useMutation({
    mutationKey: ['create-prodi'],
    mutationFn: async (data: CreateProdiInput) => {
      const response = await fetch('/api/prodi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create prodi',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Prodi berhasil dibuat')
    },
  })
}

export const useUpdateProdi = (id: string) => {
  return useMutation({
    mutationKey: ['update-prodi', id],
    mutationFn: async (data: Omit<UpdateProdiInput, 'id'>) => {
      const response = await fetch(`/api/prodi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update prodi',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Prodi berhasil diperbarui')
    },
  })
}

export const useDeleteProdi = (id: string) => {
  return useMutation({
    mutationKey: ['delete-prodi', id],
    mutationFn: async () => {
      const response = await fetch(`/api/prodi/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete prodi',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Prodi berhasil dihapus')
    },
  })
}
