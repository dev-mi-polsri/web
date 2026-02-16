import { StandardErrorResponse } from '@/app/api/_common'
import { CreateAgendaInput, UpdateAgendaInput } from '@/server-actions/agenda'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from './_common'
import { toast } from 'sonner'

export const useCreateAgenda = () => {
  return useMutation({
    mutationKey: ['create-agenda'],
    mutationFn: async (data: CreateAgendaInput) => {
      const response = await fetch('/api/agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to create agenda',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Agenda berhasil dibuat')
    },
  })
}

export const useUpdateAgenda = (id: string) => {
  return useMutation({
    mutationKey: ['update-agenda', id],
    mutationFn: async (data: Omit<UpdateAgendaInput, 'id'>) => {
      const response = await fetch(`/api/agenda/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to update agenda',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Agenda berhasil diperbarui')
    },
  })
}

export const useDeleteAgenda = (id: string) => {
  return useMutation({
    mutationKey: ['delete-agenda', id],
    mutationFn: async () => {
      const response = await fetch(`/api/agenda/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData: StandardErrorResponse = await response.json()
        throw new MutationError(
          errorData.error || 'Failed to delete agenda',
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
        )
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Agenda berhasil dihapus')
    },
  })
}
