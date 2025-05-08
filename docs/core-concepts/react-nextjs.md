# React and Next.js Fundamentals

## Server vs Client Components

### Server Components

Server Components are the default in Next.js 14+ and are used extensively in this project. They:

- Execute on the server
- Can directly access backend resources
- Reduce client-side JavaScript
- Improve initial page load

Example from our codebase:

```tsx
// No 'use client' directive needed
async function StudyPrograms({ locale }: { locale: string }) {
  const payload = await getPayload({ config })
  // Direct database access
  const studyPrograms = await payload.find({
    collection: 'studyprogram',
    // ...
  })
  return (
    // JSX
  )
}
```

### Client Components

Client Components are used for interactive features and are marked with 'use client'. They:

- Execute in the browser
- Can use hooks and browser APIs
- Handle user interactions
- Manage client-side state

Example from our codebase:

```tsx
'use client'

function FeaturedNews() {
  const { data: news, isPending } = useNews({ limit: 3, featured: true })
  // Client-side state and effects
  return (
    // Interactive JSX
  )
}
```

## Page Routing

### Dynamic Routes

The project uses Next.js dynamic routes for internationalization and content pages:

```
app/
└── (frontend)/
    └── [locale]/           # Dynamic locale routing
        ├── news/
        │   └── [slug]/     # Dynamic news articles
        └── program/
            └── [slug]/     # Dynamic program pages
```

### Route Groups

Route groups are used to organize related routes:

- `(frontend)` - Public website routes
- `(payload)` - CMS admin routes
- `(sitemap)` - SEO-related routes

## Data Fetching Patterns

### Server-Side Data Fetching

Used in Server Components for direct data access:

```tsx
const payload = await getPayload({ config })
const data = await payload.find({
  collection: 'news',
  // ...
})
```

### Client-Side Data Fetching

Implemented using React Query through custom hooks:

```tsx
const { data, isPending } = useNews({
  searchKeyword,
  limit: 12,
  page,
})
```

## Component Composition

### Layout Components

- Shared layouts in `layout.tsx` files
- Nested layouts for different sections
- Consistent UI elements across pages

### Page Components

- Main content containers
- Composed of multiple smaller components
- Handle data fetching and state management

### UI Components

- Reusable components in `/components`
- Follows atomic design principles
- Built on top of shadcn/ui

## Best Practices

1. **Component Organization**

   - Group by feature in `_sections` and `_components`
   - Shared components in root `/components`
   - Clear separation of concerns

2. **Data Fetching**

   - Prefer server components for initial data
   - Use React Query for client-side updates
   - Implement proper loading states

3. **Performance**

   - Lazy loading for client components
   - Image optimization with next/image
   - Proper use of caching strategies

4. **Type Safety**
   - TypeScript for all components
   - Proper prop typing
   - PayloadCMS type generation
