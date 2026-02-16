import { StandardErrorResponse } from '@/app/api/_common'
import { CreateDokumenInput, UpdateDokumenInput } from '@/server-actions/dokumen'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateDokumen = () => {
  return useMutation({
    mutationKey: ['create-dokumen'],
    mutationFn: async (data: CreateDokumenInput) => {
      const response = await fetch('/api/dokumen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create dokumen',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Dokumen berhasil dibuat')
    },
  })
}

export const useUpdateDokumen = (id: string) => {
  return useMutation({
    mutationKey: ['update-dokumen', id],
    mutationFn: async (data: Omit<UpdateDokumenInput, 'id'>) => {
      const response = await fetch(`/api/dokumen/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update dokumen',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Dokumen berhasil diperbarui')
    },
  })
}

export const useDeleteDokumen = (id: string) => {
  return useMutation({
    mutationKey: ['delete-dokumen', id],
    mutationFn: async () => {
      const response = await fetch(`/api/dokumen/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete dokumen',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Dokumen berhasil dihapus')
    },
  })
}
