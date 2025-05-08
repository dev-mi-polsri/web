# Data Management

## Overview

The MI Polsri website implements robust data management patterns for:

- Pagination
- Sorting
- Filtering
- Data transformation
- Caching strategies
- Error handling

## Pagination Implementation

### Server-Side Pagination

```typescript
async function getPaginatedNews({ page = 1, limit = 10 }: PaginationParams) {
  const payload = await getPayload()
  return await payload.find({
    collection: 'news',
    limit,
    page,
    sort: '-publishedDate',
  })
}
```

### Client-Side Pagination Hook

```typescript
function usePaginatedData<T>({ queryKey, queryFn, limit = 10 }: PaginationHookProps<T>) {
  const [page, setPage] = useState(1)

  const { data, isPending } = useQuery({
    queryKey: [queryKey, { page, limit }],
    queryFn: () => queryFn({ page, limit }),
    keepPreviousData: true,
  })

  return {
    data,
    isPending,
    page,
    setPage,
    hasNextPage: data?.hasNextPage,
    hasPrevPage: data?.hasPrevPage,
  }
}
```

## Sorting Implementation

### Sort Configuration

```typescript
type SortField = 'name' | 'date' | 'nip' | 'position'

interface SortConfig {
  field: SortField
  direction: 'asc' | 'desc'
}

function useSortedData<T>(data: T[], sortConfig: SortConfig) {
  return useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      if (a[sortConfig.field] < b[sortConfig.field]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.field] > b[sortConfig.field]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])
}
```

## Filtering Patterns

### Filter Hook

```typescript
interface FilterOptions {
  searchTerm?: string
  category?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

function useFilteredData<T>(
  data: T[],
  filters: FilterOptions,
  filterFn: (item: T, filters: FilterOptions) => boolean,
) {
  return useMemo(() => {
    return data.filter((item) => filterFn(item, filters))
  }, [data, filters, filterFn])
}
```

### Filter Implementation

```typescript
const filterNews = (news: News, filters: FilterOptions): boolean => {
  if (filters.searchTerm) {
    const search = filters.searchTerm.toLowerCase()
    if (
      !news.title.toLowerCase().includes(search) &&
      !news.content.toLowerCase().includes(search)
    ) {
      return false
    }
  }

  if (filters.category && news.category !== filters.category) {
    return false
  }

  if (filters.tags?.length) {
    if (!filters.tags.some((tag) => news.tags.includes(tag))) {
      return false
    }
  }

  if (filters.dateRange) {
    const newsDate = new Date(news.publishedDate)
    if (newsDate < filters.dateRange.start || newsDate > filters.dateRange.end) {
      return false
    }
  }

  return true
}
```

## Data Transformation

### Response Transformation

```typescript
interface ApiResponse<T> {
  data: T
  meta: {
    page: number
    totalPages: number
    totalItems: number
  }
}

function transformResponse<T, R>(
  response: ApiResponse<T>,
  transformer: (item: T) => R,
): ApiResponse<R> {
  return {
    data: Array.isArray(response.data)
      ? response.data.map(transformer)
      : transformer(response.data),
    meta: response.meta,
  }
}
```

### Entity Transformers

```typescript
function transformProfile(raw: RawProfile): Profile {
  return {
    id: raw.id,
    name: raw.name,
    title: raw.title,
    nip: raw.nip,
    email: raw.email,
    phone: formatPhoneNumber(raw.phone),
    image: transformMediaUrl(raw.image),
    department: raw.department?.name || null,
    publications: raw.publications?.map(transformPublication) || [],
  }
}
```

## Caching Strategy

### Query Cache Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

### Prefetching Data

```typescript
async function prefetchNewsData(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['news', { page: 1, limit: 10 }],
    queryFn: () => getNewsData({ page: 1, limit: 10 }),
  })
}
```

## Error Handling

### Error Types

```typescript
type ApiError = {
  code: string
  message: string
  details?: Record<string, string[]>
}

class CustomError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'CustomError'
  }
}
```

### Error Handling Hook

```typescript
function useErrorHandler() {
  const [error, setError] = useState<ApiError | null>(null)

  const handleError = useCallback((error: unknown) => {
    if (error instanceof CustomError) {
      setError({
        code: error.code,
        message: error.message,
        details: error.details,
      })
    } else {
      setError({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      })
    }
  }, [])

  return {
    error,
    setError,
    handleError,
    clearError: () => setError(null),
  }
}
```

## Best Practices

1. **Data Loading**

   - Implement loading states
   - Show placeholders/skeletons
   - Handle error states gracefully

2. **Performance**

   - Use pagination for large datasets
   - Implement proper caching
   - Optimize data transformations

3. **User Experience**

   - Maintain data consistency
   - Provide clear feedback
   - Implement proper validation

4. **Maintenance**
   - Document data structures
   - Use TypeScript for type safety
   - Implement proper logging
