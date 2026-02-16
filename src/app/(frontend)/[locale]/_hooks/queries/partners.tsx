import { useQuery } from '@tanstack/react-query'

/**
 * **DEPRECATION ALERT**: This feature has been removed.
 * @param limit
 * @returns
 */
export function usePartners(limit: number) {
  const fetchData = () => null
  return useQuery({
    queryKey: ['partners'],
    queryFn: fetchData,
  })
}
