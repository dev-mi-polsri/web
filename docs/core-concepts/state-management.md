# State Management

## Overview

The MI Polsri website uses a combination of state management approaches:

- React Query for server state
- React hooks for local state
- Context API for global state
- Custom hooks for reusable state logic

## React Query

### Basic Usage

```tsx
import { useQuery } from '@tanstack/react-query'

function NewsPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  })
}
```

### Custom Hooks

The project implements custom hooks for data fetching:

```tsx
// Custom hook for news data
function useNews({ limit = 10, page = 1, featured }: NewsQueryParams) {
  return useQuery({
    queryKey: ['news', { limit, page, featured }],
    queryFn: () => fetchNews({ limit, page, featured }),
  })
}

// Usage
const { data: news, isPending } = useNews({
  limit: 3,
  featured: true,
})
```

## Local State Management

### React Hooks

Common hooks used in the project:

```tsx
// useState for simple state
const [isOpen, setIsOpen] = useState(false)

// useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState)

// useRef for mutable values
const intervalRef = useRef<NodeJS.Timeout>()
```

### Custom State Hooks

Example of a custom state hook:

```tsx
function usePagination({ totalItems, itemsPerPage }: PaginationProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return {
    page,
    setPage,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
```

## Global State

### Context API

Used for global state that needs to be accessed by multiple components:

```tsx
// Language context
const LanguageContext = createContext<{
  locale: string
  setLocale: (locale: string) => void
}>({
  locale: 'id',
  setLocale: () => {},
})

// Provider component
function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('id')

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
  )
}
```

## State Management Best Practices

1. **Server State**

   - Use React Query for all API data
   - Implement proper caching strategies
   - Handle loading and error states

2. **Local State**

   - Keep state as close as possible to where it's used
   - Use composition to avoid prop drilling
   - Implement proper type safety

3. **Performance**

   - Memoize expensive calculations
   - Use proper dependency arrays in hooks
   - Avoid unnecessary re-renders

4. **Error Handling**
   ```tsx
   const { data, error, isError } = useQuery({
     queryKey: ['data'],
     queryFn: fetchData,
     onError: (error) => {
       // Handle error
     },
   })
   ```

## Common Patterns

### Data Loading States

```tsx
function DataComponent() {
  const { data, isPending, isError, error } = useQuery({
    /*...*/
  })

  if (isPending) return <LoadingSpinner />
  if (isError) return <ErrorMessage error={error} />

  return <DisplayData data={data} />
}
```

### Form State

```tsx
function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
}
```

### Mutation State

```tsx
const mutation = useMutation({
  mutationFn: updateNews,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['news'] })
  },
})
```

## Testing State

### Testing Hooks

```tsx
import { renderHook } from '@testing-library/react'

test('usePagination hook', () => {
  const { result } = renderHook(() => usePagination({ totalItems: 100, itemsPerPage: 10 }))

  expect(result.current.totalPages).toBe(10)
})
```

### Testing Components with State

```tsx
import { render, screen } from '@testing-library/react'

test('NewsCard displays data', () => {
  render(<NewsCard news={mockNews} />)
  expect(screen.getByText(mockNews.title)).toBeInTheDocument()
})
```
