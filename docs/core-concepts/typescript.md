# TypeScript in MI Polsri

## Type System Overview

### PayloadCMS Generated Types

The project uses automatically generated TypeScript types from PayloadCMS collections:

```ts
import { Media, Studyprogram } from '@/payload-types'

// Types are strongly typed from CMS collections
interface NewsProps {
  thumbnail: Media
  name: string
  content?: any // Rich text content
  slug: string
  tags?: Array<{ tag: string }>
  global: boolean
}
```

## Key Type Patterns

### Collection Types

PayloadCMS collections are typed through the collection configuration:

```ts
const News: CollectionConfig = {
  slug: 'news',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // ... other fields
  ],
}
```

### Component Props

Components use TypeScript interfaces for prop definitions:

```ts
interface StudyProgramCardProps {
  thumbnail: Media
  name: string
  description: string
  slug: string
  locale: string
  t: Record<string, string>
}
```

### Generic Types

Common generic types used in the project:

```ts
// Pagination type from PayloadCMS
type PaginatedDocs<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Used in hooks like useNews
const { data } = useNews<PaginatedDocs<News>>()
```

## Type Safety with CMS

### Media Types

```ts
type Media = {
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
}
```

### Content Types

```ts
type RichTextContent = {
  // PayloadCMS rich text editor types
  root: {
    children: Array<{
      type: string
      value?: string
      children?: Array<any>
      // ... other properties
    }>
  }
}
```

## Best Practices

1. **Type Inference**

   - Let TypeScript infer types when possible
   - Use explicit types for complex objects
   - Avoid `any` unless absolutely necessary

2. **Strict Mode**

   - Project uses strict TypeScript configuration
   - Null checks enabled
   - Strict property initialization

3. **Type Organization**

   - Generated types in `payload-types.ts`
   - Custom types near their usage
   - Shared types in separate files

4. **Type Guards**
   ```ts
   function isMediaObject(obj: any): obj is Media {
     return obj && typeof obj === 'object' && 'url' in obj
   }
   ```

## Common Patterns

### Hook Types

```ts
function useNews({ limit, page, featured }: { limit?: number; page?: number; featured?: boolean }) {
  // Implementation
}
```

### Route Params

```ts
type PageParams = {
  params: {
    locale: string
    slug?: string
  }
}
```

### API Response Types

```ts
type ApiResponse<T> = {
  data: T
  status: number
  message?: string
}
```

## Type Safety Examples

### Form Data

```ts
interface ContactForm {
  name: string
  email: string
  message: string
}

// Used with form libraries and validation
const handleSubmit = (data: ContactForm) => {
  // Type-safe form handling
}
```

### API Routes

```ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<News>>,
) {
  // Type-safe API handling
}
```
