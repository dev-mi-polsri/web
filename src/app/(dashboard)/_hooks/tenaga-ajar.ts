import { StandardErrorResponse } from '@/app/api/_common'
import { CreateTenagaAjarInput, UpdateTenagaAjarInput } from '@/server-actions/tenaga-ajar'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateTenagaAjar = () => {
  return useMutation({
    mutationKey: ['create-tenaga-ajar'],
    mutationFn: async (data: CreateTenagaAjarInput) => {
      const response = await fetch('/api/tenaga-ajar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create tenaga ajar',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Tenaga ajar berhasil dibuat')
    },
  })
}

export const useUpdateTenagaAjar = (id: string) => {
  return useMutation({
    mutationKey: ['update-tenaga-ajar', id],
    mutationFn: async (data: Omit<UpdateTenagaAjarInput, 'id'>) => {
      const response = await fetch(`/api/tenaga-ajar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update tenaga ajar',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Tenaga ajar berhasil diperbarui')
    },
  })
}

export const useDeleteTenagaAjar = (id: string) => {
  return useMutation({
    mutationKey: ['delete-tenaga-ajar', id],
    mutationFn: async () => {
      const response = await fetch(`/api/tenaga-ajar/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete tenaga ajar',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Tenaga ajar berhasil dihapus')
    },
  })
}
