'use client'
import { MutationError } from '@/app/(dashboard)/_hooks/_common'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: unknown) => {
        if (error instanceof MutationError) {
          toast.error(error.message || 'An error occurred', {
            description: `${error.errorCode} (${error.errorStatus})`,
          })
        }
      },
    },
  },
})

export function QueryProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
    </QueryClientProvider>
  )
}
