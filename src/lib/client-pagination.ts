'use client'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type HandleSearchParams = {
  // @ts-ignore
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  onSearch?: (term: string) => void
}

export const handleClientSearch = ({ searchParams, router, onSearch }: HandleSearchParams) => {
  const params = new URLSearchParams(searchParams)

  return (term: string) => {
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    onSearch?.(term)
    router.replace(`?${params.toString()}`)
  }
}

export const handleClientPageChange = ({
  searchParams,
  router,
  onChange,
}: {
  // @ts-ignore
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  onChange?: (page: number) => void
}) => {
  const params = new URLSearchParams(searchParams)

  return (page: number) => {
    params.set('page', page.toString())

    onChange?.(page)

    router.replace(`?${params.toString()}`)
  }
}

export const handleClientSizeChange = ({
  searchParams,
  router,
  onChange,
}: {
  // @ts-ignore
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  onChange?: (size: number) => void
}) => {
  const params = new URLSearchParams(searchParams)
  return (size: number) => {
    params.set('size', size.toString())
    params.set('page', '1')

    onChange?.(size)
    router.replace(`?${params.toString()}`)
  }
}
