import { StandardErrorResponse } from '@/app/api/_common'

export async function deleteResource(endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData: StandardErrorResponse = await response.json()
    throw new Error(errorData.error || 'Failed to delete resource')
  }

  window.location.reload()
}
